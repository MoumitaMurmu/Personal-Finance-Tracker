import React, { useState } from 'react'
import Header from '../Components/Header';
import Cards from '../Components/Cards';
import AddIncomeModal from '../Components/Modals/AddIncomeModal';
import AddExpenseModal from '../Components/Modals/AddExpenseModal';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import TransactionsTable from '../Components/TransactionsTable.js';
import ChartsComponent from '../Components/Charts';
import NoTransactions from '../Components/NoTransactions';


const Dashboard = () => {
  const[transactions, setTransactions] = useState([]);
  const[loading, setLoading] = useState(false);
  const[user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] =  useState(false);
  const[income, setIncome] = useState(0);
  const[expense, setExpense] = useState(0);
  const[totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type) => {
    console.log("On Finish", values, type);
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  }

  async function addTransaction(transaction, many) {
    // Add the doc
try{
  const docRef = await addDoc(
    collection(db, `users/${user.uid}/transactions`),
    transaction
  );
  console.log("Document written with ID: ", docRef.id);
 if(!many) toast.success("Transaction Added!");
  let newArr = transactions;
  newArr.push(transaction);
  setTransactions(newArr);
  calculateBalance();
}catch(e){
  console.error("Error adding document: ", e);
  if(!many)  toast.error("Couldn't add transaction");

}
  }

  useEffect(()=>{
// GET ALL DOC FROM COLLECTIONS
fetchTransactions();
  },[user]);

  async function fetchTransactions() {
    setLoading(true);

    if(user){
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc)=>{
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  useEffect(() => {
    calculateBalance();
  }, [transactions])

  function calculateBalance(){
     let incomeTotal = 0;
     let expaensesTotal = 0;
     transactions.forEach((transaction)=>{
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expaensesTotal += transaction.amount;
      }
     });
     setIncome(incomeTotal);
     setExpense(expaensesTotal);
     setTotalBalance(incomeTotal - expaensesTotal);
  };
  
  

  return (
    <div>
      <Header/>
    {
      loading ? (
        <p>Loading...</p>
      ) : (
        <>
  
    <Cards
      income={income}
      expense={expense}
      totalBalance={totalBalance}
      showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
    />
    {/* {transactions.length != 0 ? <ChartsComponent sortedTransactions={sortedTransactions}/> : <NoTransactions/>} */}
   <AddExpenseModal
      isExpenseModalVisible={isExpenseModalVisible}
     handleExpenseCancel={handleExpenseCancel}
     onFinish={onFinish}
      />

       <AddIncomeModal
      isIncomeModalVisible={isIncomeModalVisible}
       handleIncomeCancel={handleIncomeCancel}
       onFinish={onFinish}
     /> 
      </>
      )
    }
      <TransactionsTable transactions={transactions}  addTransaction={addTransaction}   fetchTransactions={fetchTransactions}/>
      </div>
  )
}

export default Dashboard;
   
      
     
  
     

  