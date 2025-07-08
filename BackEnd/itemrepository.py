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
from category_repository import category_repo
from policies_repository import policy_repo
from sqlalchemy import text


class item_repo(db_class):
    Base = declarative_base()

    class Category(Base):
        __tablename__ = "category"
        category_id = Column(Integer, primary_key=True)

    class ListItem(Base):
        __tablename__ = "list_items"

        product_id = Column(Integer, primary_key=True, autoincrement=True)
        product_name = Column(String(100), nullable=False)
        MRP = Column(Float, nullable=False)
        discount = Column(Float)
        stock_avl = Column(Integer)
        free_delivery_status = Column(Boolean, nullable=False)
        item_category = Column(
            Integer, ForeignKey("category.category_id"), nullable=False
        )
        product_image = Column(String(100), nullable=False)
        applicable_policies = Column(String(250), nullable=False)
        specs = Column(String(100), nullable=False)

    def getdata(self, product_id):
        session = self.Session()
        try:
            item = session.query(self.ListItem).filter_by(product_id=product_id).first()
            if item:
                item_dict = {
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "MRP": item.MRP,
                    "discount": item.discount,
                    "stock_avl": item.stock_avl,
                    "free_delivery_status": item.free_delivery_status,
                    "item_category": item.item_category,
                    "product_image": item.product_image,
                    "applicable_policies": item.applicable_policies,
                    "specs": item.specs,
                }
                return item_dict
            else:
                return None
        finally:
            session.close()

    def add_item(
        self,
        name,
        mrp,
        discount,
        stock,
        free_delivery: bool,
        category_id,
        image,
        policies,
        specs,
    ):
        session = self.Session()
        try:
            item = self.ListItem(
                product_name=name,
                MRP=mrp,
                discount=discount,
                stock_avl=stock,
                free_delivery_status=free_delivery,
                item_category=category_id,
                product_image=image,
                applicable_policies=policies,
                specs=specs,
            )
            session.add(item)
            session.commit()
            print(f" Added item: {name}")
        finally:
            session.close()

    def delete_item(self, product_id):
        session = self.Session()
        try:
            item = session.query(self.ListItem).filter_by(product_id=product_id).first()
            if item:
                session.delete(item)
                session.commit()
                print(f" Deleted item with product_id: {product_id}")
            else:
                print(" Item not found.")
        finally:
            session.close()

    def get_paginated_items(self, offset=0, limit=10):
        session = db_class.Session()
        try:
            result = session.execute(
                text("SELECT * FROM list_items LIMIT :limit OFFSET :offset"),
                {"limit": limit, "offset": offset}
            ).fetchall()
            return [dict(row) for row in result]
        finally:
            session.close()

    def view_all_items_by_category(self, category_id):
        session = self.Session()
        try:
            items = (
                session.query(self.ListItem).filter_by(item_category=category_id).all()
            )
            items_list = []
            for item in items:
                item_dict = {
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "MRP": item.MRP,
                    "discount": item.discount,
                    "stock_avl": item.stock_avl,
                    "free_delivery_status": item.free_delivery_status,
                    "item_category": item.item_category,
                    "product_image": item.product_image,
                    "applicable_policies": item.applicable_policies,
                    "specs": item.specs,
                }
                items_list.append(item_dict)
            return items_list
        finally:
            session.close()

    def view_all_details_of_item(self, product_id):
        session = self.Session()
        try:
            item = session.query(self.ListItem).filter_by(product_id=product_id).first()
            if item:
                category_name = category_repo().get_category_name_by_id(
                    item.item_category
                )
                policy_details = policy_repo().get_policy_details_from_productid(
                    item.applicable_policies
                )

                item_dict = {
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "MRP": item.MRP,
                    "discount": item.discount,
                    "stock_avl": item.stock_avl,
                    "free_delivery_status": item.free_delivery_status,
                    "item_category": item.item_category,
                    "category_name": category_name,
                    "product_image": item.product_image,
                    "applicable_policies": policy_details,
                    "specs": item.specs,
                }
                return item_dict
            else:
                return None
        finally:
            session.close()


if __name__ == "__main__":
    db = item_repo()
    """db.add_item(
        name="Wireless Earbuds",
        mrp=3999,
        discount=15,
        stock=50,
        free_delivery=True,
        category_id=1,
        image="earbuds.jpg",
        policies="Return in 10 days",
        specs="Bluetooth 5.3, Noise Cancellation"
    )"""
    # db.getdata(1)
    # db.delete_item(51)
    db.view_all_items()
