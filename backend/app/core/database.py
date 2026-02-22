from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None


db = Database()


async def get_database():
    """Get database instance."""
    return db.db


async def connect_to_mongo():
    """Create database connection."""
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.db = db.client[settings.MONGODB_DB_NAME]
    print(f"Connected to MongoDB at {settings.MONGODB_URL}")
    print(f"Using database: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close database connection."""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
