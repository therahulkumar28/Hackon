import CustomerDetails from "../components/CustomerDetail"
import TransactionGraph from "../components/MonthlySavings"
import Appbar from "../components/Appbar"
import SavingsGraph from "../components/SavingsGraph"
import SpendingByCategory from "../components/SpendingbyCategoryGraph"
import Transaction from "../components/Transactions"



const PaymentHistory = () => {
  return (
    <div className="">
      <Appbar/>
        <CustomerDetails/>
        <div className="flex flex-wrap font-extrabold text-center text-2xl">Check your Spending by Category</div>
        <SpendingByCategory/>
        <div className="flex flex-wrap font-extrabold text-center text-2xl">Check your Spending on Particular Product in Graph Format</div>
        <TransactionGraph/>
        <br></br>
        <SavingsGraph/>
        <Transaction/>
    </div>
  )
}

export default PaymentHistory