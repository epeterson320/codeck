# Codeck
Encode a string of text in the ordering of a deck of cards.

I've always thought it would be cool to use a deck of cards to encode a secret
message. This is a work in progress, but the goal is to make a small web app to
do the transformation of text to and from an ordered deck of cards.

The encoding process is
Deck -> Permutation -> Factoradic -> Decimal -> Base 37 -> Text

Fun reading:

* https://en.wikipedia.org/wiki/Factorial_number_system
* https://en.wikipedia.org/wiki/Bijective_numeration
* https://en.wikipedia.org/wiki/Lehmer_code
