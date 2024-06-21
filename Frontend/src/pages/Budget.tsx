import Appbar from "../components/Appbar"
import SavingsGraph from "../components/SavingsGraph"
import Transactions from "../components/Transactions"

const Budget = () => {
  return (
    <div min-h-screen>
        <Appbar/>
        <SavingsGraph/>
        <Transactions/>
    </div>
  )
}

export default Budget