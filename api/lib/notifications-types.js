// in this file should be the formatting of the events to user readable content
const eventTypes = {
  BLOCK: 'block',
  TRANSACTION_RECEIVE: 'transactionReceive',
  TRANSACTION_SEND: 'transactionSend',
  VALIDATOR_COMMISSION: 'validatorCommission',
  VALIDATOR_STATUS: 'validatorStatus',
  VALIDATOR_VOTING_POWER_INCREASE: 'validatorVotingPowerIncrease',
  VALIDATOR_VOTING_POWER_DECREASE: 'validatorVotingPowerDecrease',
  VALIDATOR_PICTURE: 'validatorPicture',
  VALIDATOR_DESCRIPTION: 'validatorDescription',
  VALIDATOR_WEBSITE: 'validatorWebsite',
  VALIDATOR_MAX_CHANGE_COMMISSION: 'validatorMaxChangeCommission',
  PROPOSAL_CREATE: 'proposalCreate',
  PROPOSAL_UPDATE: 'proposalChange'
}

const resourceTypes = {
  TRANSACTION: 'transaction',
  VALIDATOR: 'validator',
  PROPOSAL: 'proposal'
}

/**
 * Returns list of default subscription topics
 *
 * @param { [ Object] } addresses all addresses associated with user account
 * @param {string} addresses.address single address associated with user account
 * @param {string} addresses.networkId associated networkId with address
 * @return { [string] } topics
 */
const getDefaultSubscriptions = async (addresses, dataSources) => {
  let subscriptions = []

  for (const { address, networkId } of addresses) {
    const delegations = await dataSources[
      networkId
    ].api.getDelegationsForDelegatorAddress(address)

    delegations.forEach((delegation) => {
      subscriptions.push(
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_COMMISSION}_${networkId}`,
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_STATUS}_${networkId}`,
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_VOTING_POWER_INCREASE}_${networkId}`,
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_VOTING_POWER_DECREASE}_${networkId}`,
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_PICTURE}_${networkId}`,
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_WEBSITE}_${networkId}`,
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_MAX_CHANGE_COMMISSION}_${networkId}`,
        `${delegation.validatorAddress}_${eventTypes.VALIDATOR_DESCRIPTION}_${networkId}`
      )
    })

    subscriptions.push(
      `${address}_${eventTypes.TRANSACTION_RECEIVE}_${networkId}`,
      `${address}_${eventTypes.TRANSACTION_SEND}_${networkId}`,
      `${eventTypes.PROPOSAL_CREATE}_${networkId}`,
      `${eventTypes.PROPOSAL_UPDATE}_${networkId}`
    )
  }

  return subscriptions
}

module.exports = {
  eventTypes,
  resourceTypes,
  getDefaultSubscriptions
}
