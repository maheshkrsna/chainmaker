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

    describe('Create new Block', function() {
        it('Should create a new Block Object', function() {
            let block1 = new Block(DATA, PREVIOUS_HASH);
            block1.should.have.property('data').equal(DATA);
            block1.should.have.property('previousHash').equal(PREVIOUS_HASH);
            block1.should.have.property('timeStamp').equal(Date.now());
        });
        it('Should calculate and assign hash onto Block Object', function() {
            const GENERATED_HASH = sha256()
                .update(DATA + PREVIOUS_HASH + Date.now())
                .digest('hex')
                .toString();

            let block1 = new Block(DATA, PREVIOUS_HASH);
            block1.should.have.property('hash').equal(GENERATED_HASH);
        });
    });
});
