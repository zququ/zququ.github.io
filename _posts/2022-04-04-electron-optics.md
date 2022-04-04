---
layout: post
title: Electron optics 1
date: 2022-04-04 11:18:00:24.000000000 +09:00
tags: cryo-EM
---
All content are summarised from High-Resolution Electron Microscopy (Fourth Edition, Oxford university press) of John C. H. Spence.

<!-- TOC GFM -->

* [The Electron Wavelength and Relativity](#the-electron-wavelength-and-relativity)
	- [Four Problems of EM](#four-problems-of-em)
	- [The Wavelength $\lambda$](#the-wavelength-lambda)

<!-- /TOC -->

## The Electron Wavelength and Relativity

### Four Problems of EM

Rather than solve the Schrodinger equation for the electron microscope as a whole, it is simpler to separate the four problems:

1. Beam–specimen interactions
2. Magnetic lens action
3. Detection
4. Fast electron sources

And a wavelength is assigned to the fast electron.

### The Wavelength $\lambda$ 

From the ***de Broglie*** relation,

$$
p = mv = h/\lambda
$$

and 

$$
E = 1/2mv^2
$$

We can get the principle of conservation of energy applied to an electron of charge −e traversing a region in which the potential varies from $0$ to $V_0$:

$$
eV_0 = p^2/2m = h^2/2m\lambda^2 \tag{1}
$$

where where p is the electron momentum and h is Planck’s constant, and 

$$
\lambda = \frac{h}{\sqrt{2meV_0}} \tag{2}
$$

An electron leaves the ﬁlament with high potential energy and thermal kinetic energy, and arrives at the anode with no potential energy and high kinetic energy. The zero of potential energy is taken at ground potential. If $\lambda$ is in nanometres and $V_0$ in volts, then

$$
\lambda = 1.22639/\sqrt{V_0} \tag{3}
$$

At higher energies the relativistic variation of electron mass must be considered. Neglect of this leads to a 5% error in λ at 100 kV. The relativistically corrected mass is

$$
m = m_0/(1 - v^2/c^2)^{1/2} 
$$

and the relativistic equation corresponding to eqn $(1)$ is

$$
eV_0 = (m - m_0)c^2
$$

with $m_0$ the electron rest mass and c the velocity of light. These equations may be combined to give an expression for the electron momentum mv. Used in the *de Broglie* relation, this gives the relativistically corrected electron wavelength as

$$
\lambda = h/(2m_0eV_r)^{1/2} \tag{4}
$$
S
where

$$
V_r = V_0 + \left(\frac{e}{2m_0c^2}\right)V_0^2
$$

is the ‘relativistic accelerating voltage’, ***introduced as a convenience***. For computer calculations the value of $\lambda$ may be taken as

$$
\lambda = 1.22639/(V_0 + 0.97845 \times 10^{-6}V_0^2 )^{1/2} \tag{5}
$$

with $V_0$ the microscope accelerating voltage in volts and $\lambda$ in nanometres.









