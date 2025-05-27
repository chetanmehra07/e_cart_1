from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker


engine = create_engine("mysql+mysqlconnector://chetan_mysql:Chetan%400711@localhost:3306/e_cart")

Base = declarative_base()

class Category(Base):
    __tablename__ = 'category'
    category_id = Column(Integer, primary_key=True)

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

Session = sessionmaker(bind=engine)
session = Session()

def add_item(name, mrp, discount, stock, free_delivery, category_id, image, policies, specs):
    item = ListItem(
        product_name=name,
        MRP=mrp,
        discount=discount,
        stock_avl=stock,
        free_delivery_status=free_delivery,
        item_category=category_id,
        product_image=image,
        applicable_policies=policies,
        specs=specs
    )
    session.add(item)
    session.commit()
    print(f" Added item: {name}")

def delete_item(product_id):
    item = session.query(ListItem).filter_by(product_id=product_id).first()
    if item:
        session.delete(item)
        session.commit()
        print(f" Deleted item with product_id: {product_id}")
    else:
        print(" Item not found.")

def view_all_items():
    items = session.query(ListItem).all()
    print("\n All Items in list_items Table:\n")
    for item in items:
        print(f"ID: {item.product_id} | Name: {item.product_name} | MRP: ₹{item.MRP} | Discount: {item.discount}% | Stock: {item.stock_avl} | Free Delivery: {'Yes' if item.free_delivery_status else 'No'} | Category ID: {item.item_category} | Image: {item.product_image} | Policies: {item.applicable_policies} | Specs: {item.specs}")
    print("\n End of List\n")

if __name__ == "__main__":
 
    '''add_item(
         name="Wireless Earbuds",
         mrp=3999,
         discount=15,
         stock=50,
         free_delivery=True,
         category_id=1,  # Ensure this ID exists in 'category' table
         image="earbuds.jpg",
         policies="1",
         specs="Bluetooth 5.3, Noise Cancellation".,;
    )'''

    #delete_item(46)

    view_all_items()



