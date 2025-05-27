from base_db_class import db_class
from pydantic import BaseModel
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey,UniqueConstraint

class rating_repo(db_class):
    Base = declarative_base()
    class Rating(Base):
        __tablename__ = "ratings"

        id = Column(Integer, primary_key=True, autoincrement=True)
        login_id = Column(Integer, nullable=False)
        product_id = Column(Integer, nullable=False)
        rating = Column(Integer, nullable=False)

        __table_args__ = (
            UniqueConstraint('login_id', 'product_id', name='unique_rating'),
        )
    def give_rating(self,login_id: int, product_id: int, rating: int):
        session = self.Session()
        try:
            existing = session.query(self.Rating).filter_by(login_id=login_id, product_id=product_id).first()
            if existing:
                existing.rating = rating
            else:
                new_rating = self.Rating(login_id=login_id, product_id=product_id, rating=rating)
                session.add(new_rating)
            session.commit()
            return {"message": "Rating saved successfully."}
        except Exception as e:
            print(e)
        finally:
            session.close()
    
    def get_rating(self,product_id: int):
        session = self.Session()
        try:
            ratings = session.query(self.Rating).filter_by(product_id=product_id).all()
            if not ratings:
                return {"message": "No ratings yet."}
            avg = sum([r.rating for r in ratings]) / len(ratings)
            return {"product_id": product_id, "average_rating": round(avg, 2), "total_ratings": len(ratings)}
        finally:
            session.close()