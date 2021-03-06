import { useEffect, useState } from 'react'
import { Dictionary } from 'ramda'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { TokenBalance, Tokens } from '../types'
import { useConfig } from '../contexts/ConfigContext'
import tokens from './tokens.json'
import mantleURL from './mantle.json'
import alias from './alias'

export default (
  address: string
): { loading: boolean; whitelist?: Tokens; list?: TokenBalance[] } => {
  const [result, setResult] = useState<Dictionary<string>>()
  const { chain } = useConfig()
  const { name: currentChain } = chain.current
  const whitelist = (tokens as Dictionary<Tokens | undefined>)[currentChain]
  const mantle = (mantleURL as Dictionary<string | undefined>)[currentChain]

  useEffect(() => {
    if (address && whitelist) {
      const load = async () => {
        try {
          const client = new ApolloClient({
            uri: mantle,
            cache: new InMemoryCache()
          })

          const queries = alias(
            Object.values(whitelist).map(({ token }) => ({
              token,
              contract: token,
              msg: { balance: { address } }
            }))
          )

          const { data } = await client.query({ query: queries })
          setResult(parseResult(data))
        } catch (error) {
          setResult({})
        }
      }

      load()
    }
  }, [address, whitelist, mantle])

  return {
    loading: !!whitelist && !result,
    whitelist,
    list:
      result &&
      whitelist &&
      Object.entries(result).map(([token, balance]) => ({
        ...whitelist[token],
        balance
      }))
  }
}

const parseResult = (data: Dictionary<{ Result: string }>) =>
  Object.entries(data).reduce(
    (acc, [token, { Result }]) => ({
      ...acc,
      [token]: JSON.parse(Result).balance
    }),
    {}
  )
