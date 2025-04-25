import './App.css';
import React,{ useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {Button , Card,CardContent,Typography} from "@mui/material";

function App() {
  const [expenses,setExpenses]=useState([]);
  const [total,setTotal]=useState(0);
  const [product,setProduct]=useState("");
  const [amount,setAmount]=useState("");
  const [date,setDate]=useState("");
  const handleSubmit=(e)=>{
    e.preventDefault();
    const newExpense={
      title:product,
      amount:parseFloat(amount),
      date:date,
    };

    setExpenses([...expenses,newExpense]);
    setTotal(total+newExpense.amount);
    setProduct("");
    setAmount("");
    setDate("");
  };
  const handleDelete=(index)=>{
    const updatedExpense=expenses.filter((_,i)=>i!==index);
    const updatedTotal=updatedExpense.reduce((t,e)=>t+e.amount,0);
    setExpenses(updatedExpense);
    setTotal(updatedTotal);
  };
  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <form onSubmit={handleSubmit} className="expense-form">
        <h1>Add new expense</h1>
        <input type="text" placeholder="Expense title*" 
        value={product}
        onChange={(e)=>setProduct(e.target.value)}
        required
        />
        <input type="number" placeholder='Amount*'
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
        required/>
        <input type='date'
        value={date}
        onChange={(e)=>{setDate(e.target.value)}}
        required/>
        <button type="submit">Add expense</button>
      </form>
      <div className="total-expense">
        <h3>Total Expenses: ${total.toFixed(2)}</h3>
      </div>
      <div className="expenses-list">
        {expenses.map((expense,index)=>(
          <Card key={index} sx={{maxWidth:400,margin:"10px auto"}}>
            <CardContent>
              <div className="expense-item">
                <div className="expense-details">
                  <Typography variant="h6">{expense.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                      ${expense.amount}
                  </Typography>
                </div>
                <div className="expense-date">
                  <Typography variant="body2" color="textSecondary">
                    {new Date(expense.date).toLocaleDateString()}
                  </Typography>
                </div>
                  <Button onClick={()=>handleDelete(index)}
                    color="error"
                    variant="outlined"
                    sx={{marginTop:1}}>
                      <DeleteIcon/>
                  </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
