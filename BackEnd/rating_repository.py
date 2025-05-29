from base_db_class import db_class
from pydantic import BaseModel
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey,UniqueConstraint,Date,Text

class rating_repo(db_class):
    Base = declarative_base()
    class Login(Base):
        __tablename__ = 'login'
        loginid = Column(Integer, primary_key=True, autoincrement=True)
        UserName = Column(String(50), nullable=False, unique=True)
        first_name = Column(String(50), nullable=False)
        last_name = Column(String(50), nullable=False)
        emailaddress = Column(String(100), nullable=False)
        phoneNo = Column(String(15), nullable=False)
        password = Column(String(100), nullable=False)
        DateOfBirth = Column(Date)
        gender = Column(String(10))
        address=Column(Integer ,nullable=True)

    class ListItem(Base):
        __tablename__ = 'list_items'

        product_id = Column(Integer, primary_key=True, autoincrement=True)
        product_name = Column(String(100), nullable=False)
        MRP = Column(Float, nullable=False)
        discount = Column(Float)
        stock_avl = Column(Integer)
        free_delivery_status = Column(Boolean, nullable=False)
        item_category = Column(Integer, ForeignKey("category.category_id"), nullable=False)
        product_image = Column(String(100), nullable=False)
        applicable_policies = Column(String(250), nullable=False)
        specs = Column(String(100), nullable=False)
    class Rating(Base):
        __tablename__ = "ratings"

        id = Column(Integer, primary_key=True, autoincrement=True)
        login_id = Column(Integer, nullable=False)
        product_id = Column(Integer, nullable=False)
        rating = Column(Integer, nullable=False)
        comment = Column(Text, nullable=True) 

        __table_args__ = (
            UniqueConstraint('login_id', 'product_id', name='unique_rating'),
        )
    
    def give_rating(self, login_id: int, product_id: int, rating: int, comment: str = None):
        session = self.Session()
        try:
            existing = session.query(self.Rating).filter_by(login_id=login_id, product_id=product_id).first()
            if existing:
                existing.rating = rating
                if comment is not None:
                    existing.comment = comment
            else:
                new_rating = self.Rating(login_id=login_id, product_id=product_id, rating=rating, comment=comment)
                session.add(new_rating)
            session.commit()
            print("Rating and comment saved successfully.")
            return 
        except Exception as e:
            print(e)
            return {"error": str(e)}
        finally:
            session.close()

    
    def get_rating(self, product_id: int):
        session = self.Session()
        try:
            ratings = session.query(self.Rating).filter_by(product_id=product_id).all()
            if not ratings:
                return {"message": "No ratings yet."}
            
            avg = sum([r.rating for r in ratings]) / len(ratings)
            comments = [r.comment for r in ratings if r.comment]  # only non-empty comments
            
            return {
                "product_id": product_id,
                "average_rating": round(avg, 2),
                "total_ratings": len(ratings),
                "comments": comments
            }
        finally:
            session.close()
    
    def delete_rating(self, login_id: int, product_id: int):
        session = self.Session()
        try:
            rating = session.query(self.Rating).filter_by(login_id=login_id, product_id=product_id).first()
            if rating:
                session.delete(rating)
                session.commit()
                return {"message": "Rating and comment deleted successfully."}
            else:
                return {"message": "No rating found to delete."}
        except Exception as e:
            print(e)
            return 
        finally:
            session.close()

    def delete_comment(self, login_id: int, product_id: int):
        session = self.Session()
        try:
            rating = session.query(self.Rating).filter_by(login_id=login_id, product_id=product_id).first()
            if rating:
                rating.comment = None  
                session.commit()
                return {"message": "Comment deleted successfully."}
            else:
                return {"message": "No rating found for this product by the user."}
        except Exception as e:
            print(e)
            return 
        finally:
            session.close()
