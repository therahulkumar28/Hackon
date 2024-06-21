import CustomerDetails from "../components/CustomerDetail"
import TransactionGraph from "../components/MonthlySavings"
import Appbar from "../components/Appbar"
import SpendingByCategory from "../components/SpendingbyCategoryGraph"





const PaymentHistory = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Appbar/>
        <div className="w-full ">

        <CustomerDetails/>
        </div>
        <div className="flex flex-wrap font-extrabold justify-center items-center text-2xl">Check your Spending on Particular Product in Graph Format</div>
        <div className="min-w-screen border-2px-black">

        <TransactionGraph/>
        </div>
        <div className="flex flex-wrap font-extrabold justify-center items-center text-2xl">Check your Spending by Category</div>
        <SpendingByCategory/>
    </div>
  )
}

export default PaymentHistory