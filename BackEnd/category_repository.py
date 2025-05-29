from base_db_class import db_class
from sqlalchemy.orm import declarative_base
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
)


class category_repo(db_class):
    Base = declarative_base()

    class category(Base):
        __tablename__ = "category"
        category_id = Column(Integer, primary_key=True, autoincrement=True)
        category_name = Column(String(50), nullable=False)

    def getdata(self, category_id):
        session = self.Session()
        from itemrepository import item_repo

        try:
            category_products = {}
            item = (
                session.query(self.category).filter_by(category_id=category_id).first()
            )
            if item:
                category_info = {
                    "category_id": item.category_id,
                    "category_name": item.category_name,
                }
                category_products["category_info"] = category_info

                category_products["category_products"] = (
                    item_repo().view_all_items_by_category(category_id)
                )
                return category_products
            else:
                print("not found")
                return None
        finally:
            session.close()

    def view_all_categories(self):
        session = self.Session()
        try:
            categories = session.query(self.category).all()
            result = []
            for items in categories:
                result.append(
                    {
                        "category_id": items.category_id,
                        "category_name": items.category_name,
                    }
                )
            return result
        finally:
            session.close()

    def get_category_name_by_id(self, category_id):
        session = self.Session()
        try:
            category = (
                session.query(self.category).filter_by(category_id=category_id).first()
            )
            if category:
                return category.category_name
            else:
                return None
        finally:
            session.close()
