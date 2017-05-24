# Codeck
Encode a string of text in the ordering of a deck of cards.

I've always thought it would be cool to use a deck of cards to encode a secret
message. This was a fun side project and a great opportunity to explore new
front-end technologies. The result is a small web app to do the 
transformation of text to and from an ordered deck of cards.

## Technology Used

* [D3.js](https://d3js.org), a fantastic data visualization and animation library.
* [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API),
  so it works offline-first.
* [Web Application Manifest](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest),
  so it can be installed like a native app and added to a device's home screen.
* Responsive CSS Sprites to save on HTTP requests and bandwidth appropriate to the
  user agent's pixel density.
* [Webpack 2.0](https://webpack.js.org) so I can keep all my code in little files,
  put my above-the-fold CSS in the HTML `<head>` element, and webpack is just
  awesome in general.

## Implementation

The encoding process is
Deck -> Permutation -> Factoradic -> Decimal -> Base 37 -> Text

Fun reading:

* https://en.wikipedia.org/wiki/Codec
* https://en.wikipedia.org/wiki/Factorial_number_system
* https://en.wikipedia.org/wiki/Bijective_numeration
* https://en.wikipedia.org/wiki/Lehmer_code
