import React from 'react'
import useInterval from '../../hooks/useInterval'
import usePool from '../../hooks/usePool'
import useWalletStore, { PoolAccount } from '../../stores/useWalletStore'
import CardOverlay from './CardOverlay'
import PoolContribCard from './PoolContribCard'
import PoolRedeemCard from './PoolRedeemCard'

interface PoolCardProps {
  pool: PoolAccount
  round?: string
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, round }) => {
  const actions = useWalletStore((s) => s.actions)

  const { startIdo, endIdo, startRedeem, endDeposits } = usePool(pool)

  useInterval(async () => {
    // re-fetch pools once in a while
    await actions.fetchPools()
  }, 120_000)

  return (
    <CardOverlay
      title={`IDO Round ${round}`}
      endIdo={endIdo}
      startIdo={startIdo}
      startRedeem={startRedeem}
      endDeposits={endDeposits}
    >
      {startRedeem.isAfter() && <PoolContribCard pool={pool} />}
      {startRedeem.isBefore() && <PoolRedeemCard pool={pool} />}
      {/* Debug stats */}
      <div className="bg-secondary rounded-xl p-2 mt-4 space-y-3 font-mono text-xs">
        <p>
          Start Ido: {startIdo?.fromNow()} ({startIdo?.format()})
        </p>
        <p>
          End Deposits: {endDeposits?.fromNow()} ({endDeposits?.format()})
        </p>
        <p>
          End Withdraws/Ido: {endIdo?.fromNow()} ({endIdo?.format()})
        </p>
        <p>
          Start Redeem: {startRedeem?.fromNow()} ({startRedeem?.format()})
        </p>
      </div>
    </CardOverlay>
  )
}

export default PoolCard