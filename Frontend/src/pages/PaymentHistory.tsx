import PaymentAppbar from "../components/PaymentAppbar"
import SavingsGraph from "../components/SavingsGraph"
import Transaction from "../components/Transactions"



const PaymentHistory = () => {
  return (
    <div >
      <PaymentAppbar/>
        <SavingsGraph/>
        <Transaction/>
    </div>
  )
}

export default PaymentHistory