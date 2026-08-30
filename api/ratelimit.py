"""Ratenbegrenzung pro IP, im Arbeitsspeicher.

Bewusst ohne Redis: Der Dienst laeuft als eine einzelne Instanz mit einem
Arbeitsprozess. Eine zweite Komponente nur fuer einen Zaehler waere
Wartungslast ohne Gewinn. Bei einem Neustart ist der Zaehler leer — das
ist hier vertretbar, weil davor bereits nginx begrenzt.
"""

import threading
import time
from collections import deque


class SlidingWindowLimiter:
    def __init__(self, max_events: int, window_seconds: int, global_max: int = 0):
        self._max = max_events
        self._window = window_seconds
        self._global_max = global_max
        self._per_key = {}
        self._global = deque()
        self._lock = threading.Lock()

    def _prune(self, bucket, now):
        grenze = now - self._window
        while bucket and bucket[0] <= grenze:
            bucket.popleft()

    def check(self, key: str):
        """(erlaubt, wartesekunden). Zaehlt nur, wenn erlaubt."""
        now = time.monotonic()
        with self._lock:
            self._prune(self._global, now)
            if self._global_max and len(self._global) >= self._global_max:
                return False, int(self._window - (now - self._global[0])) + 1

            bucket = self._per_key.get(key)
            if bucket is None:
                bucket = self._per_key[key] = deque()
            self._prune(bucket, now)

            if len(bucket) >= self._max:
                return False, int(self._window - (now - bucket[0])) + 1

            bucket.append(now)
            self._global.append(now)

            # Leere Eintraege gelegentlich aufraeumen, damit der Speicher
            # bei vielen verschiedenen IPs nicht unbegrenzt waechst.
            if len(self._per_key) > 2048:
                for k in [k for k, v in self._per_key.items() if not v]:
                    del self._per_key[k]

            return True, 0

    def reset(self):
        with self._lock:
            self._per_key.clear()
            self._global.clear()
