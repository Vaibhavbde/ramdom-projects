import React, { useState } from 'react';

const TipCalculator = () => {
    const [billAmount, setBillAmount] = useState('');
    const [tipPercentage, setTipPercentage] = useState(15);
    const [numPeople, setNumPeople] = useState(1);
    const [totalTip, setTotalTip] = useState(0);
    const [totalPerPerson, setTotalPerPerson] = useState(0);
    const [currency, setCurrency] = useState('USD');


    const calculateTip = () => {

        if(billAmount <= 0) return alert("Please enter a valid bill amount!");
        if(tipPercentage < 0) return alert("Tip percentage cannot be negative!");
        if(numPeople <= 0) return alert("Number of people must be at least 1!");

        const tip = (billAmount * tipPercentage) / 100;
        const total = parseFloat(billAmount) + tip;
        const perPerson = total / numPeople;

        setTotalTip(tip);
        setTotalPerPerson(perPerson);
    };
    const getTipColor = () => {
        if (tipPercentage < 10) return "text-yellow-500";
        if (tipPercentage <= 20) return "text-green-500";
        return "text-red-500";
    };

    const handleBillChange = (e) => setBillAmount(e.target.value);
    const handleTipChange = (e) => setTipPercentage(e.target.value);
    const handleNumPeopleChange = (e) => setNumPeople(e.target.value);

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">

            <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border rounded px-2 py-1 mb-4"
            >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            </select>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Bill Amount:</label>
                <input
                    type="number"
                    value={billAmount}
                    onChange={handleBillChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter bill amount in ${currency==="USD"?"Dollars":`${currency==="INR"?"Rupees":"Euros"}`}`}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tip Percentage:</label>
                <input
                    type="number"
                    value={tipPercentage}
                    onChange={handleTipChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tip %"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Number of People:</label>
                <input
                    type="number"
                    value={numPeople}
                    onChange={handleNumPeopleChange}
                    min="1"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter number of people"
                />
            </div>
            <button
                onClick={calculateTip}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200"
            >
                Calculate
            </button>

            {totalTip > 0 && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-gray-800">
                    <h2 className="text-lg font-semibold">Results:</h2>
                    <p className="mt-2">Total Tip: <span className={`mt-2 font-semibold ${getTipColor()}`}>${currency==="USD"?"$":`${currency==="INR"?"₹":"€"}`}{totalTip.toFixed(2)}</span></p>
                    <p>Total Amount: <span className="font-semibold">${currency==="USD"?"$":`${currency==="INR"?"₹":"€"}`}{(parseFloat(billAmount) + totalTip).toFixed(2)}</span></p>
                    <p>Amount per Person: <span className="font-semibold">${currency==="USD"?"$":`${currency==="INR"?"₹":"€"}`}{totalPerPerson.toFixed(2)}</span></p>
                     <button onClick={() => {setCurrency('USD'); setBillAmount(''); setTipPercentage(15); setNumPeople(1); setTotalTip(0); setTotalPerPerson(0); }}   className="mt-4 w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
>Reset</button>
                </div>
            )}
           

        </div>
    );
};

export default TipCalculator;
