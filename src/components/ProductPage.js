import React, { useEffect, useState } from 'react';
import BuyForm from './BuyForm';

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedItem, setSelectedItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch("http://localhost:5000/api/products");
        const servRes = await fetch("http://localhost:5000/api/services");
        setProducts(await prodRes.json());
        setServices(await servRes.json());
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchData();
  }, []);

  const handleConfirmPurchase = async ({ item, buyerName, buyerEmail }) => {
    if (!buyerName.trim() || !buyerEmail.trim()) {
      alert('❌ Please enter your name and email to complete the purchase.');
      return;
    }

    const sale = {
      item_type: activeTab === 'products' ? 'product' : 'service',
      item_id: item.id,
      amount: item.price,
      status: 'pending',
      buyer_name: buyerName,
      buyer_email: buyerEmail,
    };

    try {
      const res = await fetch('http://localhost:5000/api/sales/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sale),
      });

      if (res.ok) {
        alert(`✅ Purchase successful for "${item.name}"!`);
        setSelectedItem(null);
      } else {
        const data = await res.json();
        alert(`❌ Purchase failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error submitting sale:', err);
      alert('❌ Could not submit purchase.');
    }
  };

  const items = activeTab === "products" ? products : services;
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product-page-container">
      <style>{`
        .product-page-container { padding: 20px; font-family: Arial, sans-serif; }
        .tabs { display: flex; gap: 10px; margin-bottom: 15px; }
        .tab-btn {
          padding: 10px 20px;
          background: #ccc;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .tab-btn.active {
          background: #0e1a35;
          color: white;
        }
        .search-input {
          padding: 8px;
          width: 250px;
          max-width: 100%;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .card {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          text-align: center;
          background: #f9f9f9;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .buy-btn {
          padding: 8px 12px;
          background-color: #0e1a35;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .buy-btn:hover {
          background-color: #1c2d59;
        }
      `}</style>

      <h1>📦 IWB Products & Services</h1>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("products")}
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`tab-btn ${activeTab === "services" ? "active" : ""}`}
        >
          Services
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="card">
            <h3>{item.name}</h3>
            <p>M{item.price}</p>
            <button className="buy-btn" onClick={() => setSelectedItem(item)}>
              Buy
            </button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <BuyForm
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </div>
  );
};

export default ProductPage;
