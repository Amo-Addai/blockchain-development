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
})
