import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SomeDapp } from '../target/types/somedapp';

describe('somedapp', () => {

    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());

    const program = anchor.workspace.Somedapp as Program<SomeDapp>;

    it('is initialized', async () => {
        const tx = await program.rpc.initialize({});
        console.log('Your transaction signature', tx);
    })

    it('Adds two numbers', async () => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(5)))
    })
})
