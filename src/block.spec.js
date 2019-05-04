import Block from './block';
import sha256 from 'hash.js/lib/hash/sha/256.js';

describe('Block.js', function() {
    const DATA = `The Times 03/Jan/2009
                Chancellor on brink of second bailout for banks`;
    const PREVIOUS_HASH = '0x00';

    beforeEach(function() {
        Date.now = function() {
            const NOW_IN_MILLISECONDS = 1556475677127;
            return NOW_IN_MILLISECONDS;
        };
    });

    // TODO: Add mineBlock method to the block as it is
    // TODO: the only exposable method of Block
    describe('Mine new Block', function() {
        it('Should mine a new Block Object', function() {
            let block1 = Block.mineBlock(PREVIOUS_HASH, DATA, 1);
            block1.should.have.property('data').equal(DATA);
            block1.should.have.property('previousHash').equal(PREVIOUS_HASH);
            block1.should.have.property('timeStamp').equal(Date.now());
            block1.should.have.property('nonce');
            block1.should.have.property('hash');
        });
        it('Should mine a new Block Object with hash conforming to difficulty',
            function() {
                let difficulty = 3;
                let difficultyString = Array(difficulty + 1).join('0');
                let block1 = Block.mineBlock(PREVIOUS_HASH, DATA, difficulty);
                block1.should.have.property('hash');
                block1.hash.substring(0, difficulty).should.
                    equal(difficultyString);
            }
        );
    });
});
