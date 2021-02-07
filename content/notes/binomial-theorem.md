Title: Binomial theorem
Date: 2021-02-07
Category: Notes

<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
      crossorigin="anonymous">

The binomial theorem is linked to Pascal's Triangle.

It's a method of multiplying out an exponential binomial, such as (x - 2)^4.

In this particular case you'd start at row 4 of pascal's triangle (starting at row 0).

The first number gets the coefficient of the first number (always 1) and is raised to the original exponent (4) and goes down to 0.  
The second number doesn't get a coefficient but get the reverse of the first exponent. So it would start at 0, and go up to 4.

---

The binomial theorem is really just the logic/maths underpinning the power rule in differentiation.  That ![]({static}/images/media/qownnotes-media-TrREMn-23149.png).

---

More precisely:

Using the formula for the derivative, in the numerator you have a difference of powers and in the denominator you have the difference in x. Using binomial expansion in the numerator, you end up with the difference in terms (x and dx) multiplied by the expanded binomial, so for example x^2 + dx^2 + 2xdx.

The first term and the denominator cancel and you're left with the expansion. As dx approaches x you can replace dx with x and the terms in the expansion combine with the powers and turn into x^-1 + x^-1 ... n times.

Key point: **n times**.

$nx^{n-1}$
