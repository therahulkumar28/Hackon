import CustomerDetails from "../components/CustomerDetail"
import TransactionGraph from "../components/MonthlySavings"
import Appbar from "../components/Appbar"
import SavingsGraph from "../components/SavingsGraph"
import SpendingByCategory from "../components/SpendingbyCategoryGraph"
import Transaction from "../components/Transactions"




const PaymentHistory = () => {
  return (
    <div className=" min-h-screen min-w-screen flex flex-col justify-center items-center">
      <Appbar/>

        <CustomerDetails/>
        <div className="flex flex-wrap justify-center items-center font-extrabold  text-2xl">Check your Spending by Category</div>
        <SpendingByCategory/>
        <div className="flex flex-wrap  font-extrabold justify-center items-center  text-2xl">Check your Spending on Particular Product in Graph Format</div>
        <TransactionGraph/>
        <SavingsGraph/>
        <Transaction/>
    </div>
  )
}

export default PaymentHistory