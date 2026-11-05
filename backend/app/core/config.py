import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "YatraTap"
    APP_ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    DEMO_MODE: bool = True
    API_PREFIX: str = "/api"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        origins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
        ]
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins


settings = Settings()

