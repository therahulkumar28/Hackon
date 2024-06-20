import PaymentAppbar from "../components/PaymentAppbar"
import SavingsGraph from "../components/SavingsGraph"
import SpendingByCategory from "../components/SpendingbyCategoryGraph"
import SetLimits from "../components/setLimits"

const PaymentHistory = () => {
  return (
    <div >
      <PaymentAppbar/>
      <h1>Customer Savings and Expenditure</h1>
      <SavingsGraph />
      <SetLimits/>
      <SpendingByCategory/>
    </div>
  )
}

export default PaymentHistory