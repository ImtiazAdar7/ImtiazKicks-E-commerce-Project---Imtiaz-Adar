import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token, updateBalance } = useAuth();
  const navigate = useNavigate();

  const presetAmounts = [100, 500, 1000, 2000, 5000];

  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/deposit`, 
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      updateBalance(response.data.newBalance);
      toast.success(`Successfully deposited ৳${amount}`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="deposit-container">
        <h1>Deposit Money</h1>
        <p>Current Balance: ৳{user?.balance}</p>

        <div className="deposit-amounts">
          {presetAmounts.map(preset => (
            <button
              key={preset}
              className={`amount-btn ${selectedAmount === preset ? 'selected' : ''}`}
              onClick={() => {
                setSelectedAmount(preset);
                setAmount(preset.toString());
              }}
            >
              ৳{preset}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label>Custom Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Enter amount"
            min="1"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDeposit}
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </div>
    </div>
  );
};

export default Deposit;