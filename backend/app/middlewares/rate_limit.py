from fastapi import Request, HTTPException
from typing import Dict, List
import time
from functools import wraps

class RateLimiter:
    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = {}

    def is_rate_limited(self, key: str) -> bool:
        now = time.time()
        if key not in self.requests:
            self.requests[key] = []

        # Clean old requests
        self.requests[key] = [req_time for req_time in self.requests[key]
                            if now - req_time < self.window_seconds]

        # Check if rate limited
        if len(self.requests[key]) >= self.max_requests:
            return True

        self.requests[key].append(now)
        return False

def rate_limit(max_requests: int = 60, window_seconds: int = 60):
    limiter = RateLimiter(max_requests, window_seconds)

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, request: Request, **kwargs):
            key = f"{request.client.host}:{request.url.path}"

            if limiter.is_rate_limited(key):
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later."
                )

            return await func(*args, **kwargs)
        return wrapper
    return decorator
