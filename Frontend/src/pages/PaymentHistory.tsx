import CustomerDetails from "../components/CustomerDetail"
import TransactionGraph from "../components/MonthlySavings"
import PaymentAppbar from "../components/PaymentAppbar"
import SavingsGraph from "../components/SavingsGraph"
import SpendingByCategory from "../components/SpendingbyCategoryGraph"
import Transaction from "../components/Transactions"



const PaymentHistory = () => {
  return (
    <div >
      <PaymentAppbar/>
        <SavingsGraph/>
        <SpendingByCategory/>
        <Transaction/>
        <TransactionGraph/>
        <CustomerDetails/>
    </div>
  )
}

export default PaymentHistory