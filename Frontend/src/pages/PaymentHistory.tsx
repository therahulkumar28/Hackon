import PaymentAppbar from "../components/PaymentAppbar"
import SavingsGraph from "../components/SavingsGraph"


const PaymentHistory = () => {
  return (
    <div >
      <PaymentAppbar/>
      <h1>Customer Savings and Expenditure</h1>
      <SavingsGraph />
    </div>
  )
}

export default PaymentHistory