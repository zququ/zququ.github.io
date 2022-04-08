---
layout: post
title: Electron optics
date: 2022-04-04 11:18:00:24.000000000 +09:00
tags: cryo-EM
---
All content are summarised from High-Resolution Electron Microscopy (Fourth Edition, Oxford university press) of John C. H. Spence.

<!-- TOC GFM -->

* [The Electron Wavelength and Relativity](#the-electron-wavelength-and-relativity)
	- [Four Problems of EM](#four-problems-of-em)
	- [The Wavelength $\lambda$](#the-wavelength-lambda)
		+ [The Wavelength at the anode ($\lambda$)](#the-wavelength-at-the-anode-lambda)
		+ [The Wavelength Through the Specimen ($\lambda'$)](#the-wavelength-through-the-specimen-lambda)
	- [Simple lens properties](#simple-lens-properties)
		+ [The ideal lens](#the-ideal-lens)

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

#### The Wavelength at the anode ($\lambda$)

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

where

$$
V_r = V_0 + \left(\frac{e}{2m_0c^2}\right)V_0^2
$$

is the ‘relativistic accelerating voltage’, ***introduced as a convenience***. For computer calculations the value of $\lambda$ may be taken as

$$
\lambda = 1.22639/(V_0 + 0.97845 \times 10^{-6}V_0^2 )^{1/2} \tag{5}
$$

with $V_0$ the microscope accelerating voltage in volts and $\lambda$ in nanometres.

####  The Wavelength Through the Specimen ($\lambda'$)
The positive electrostatic potential $\phi(r)$ (in volts) inside the specimen further accelerates the incident fast electron, resulting in a small reduction in wavelength inside the specimen.

![Figure 1](/assets/20220404/2022-04-06-15-47-17.png) 

**Figure 1** Simpliﬁed potential energy (PE) diagram for an electron microscope. The length of the vertical arrow is proportional to the kinetic energy of the fast electron and inversely proportional to the square of its wavelength. The sum of the electron’s potential energy (represented by the height of the graph) and its kinetic energy is constant. Electrons leave the ﬁlament with low kinetic energy and high potential energy (supplied by the high-voltage set) and exchange this for kinetic energy on their way to the anode, which is at ground potential. As with a ball rolling down a hill, they are further accelerated as they ‘fall in’ to the specimen. Approximate distance down the microscope column is represented on the abscissa and the potential step at the specimen has been exaggerated.

The mean value of this inner potential is given by the zero-order Fourier coeﬃcient of potential, $\upsilon_0 = \phi_0$. The refractive index $n$ of a material for electrons is then given by the ratio of wavelength $\lambda$ in a vacuum to that inside the specimen $\lambda$, so that

$$
n = \frac{\lambda}{\lambda'}=\frac{\left(\frac{1.23}{\sqrt{V_0}}\right)}{\left(\frac{1.23}{\sqrt{V_0 + \phi_0}}\right)}\approx 1 + \frac{\phi_0}{2V_0} \tag{6}
$$

**The phase shift** of a fast electron passing through a specimen of thickness t with respect to that of the vacuum is then

$$
\theta = 2\pi(n-1)t/\lambda = \pi\phi_0t/\lambda V_0 = \sigma\phi _0t \tag{7}
$$

Where, from the $eqn (1)$ we can get

$$
\begin{aligned}
\sigma & = \pi/\lambda V_0 \\
& = 2\pi me\lambda/h
\end{aligned}
$$

If the approximation is then made that the exit-face wave function can be found by computing its phase along a single optical path such as AB (contributions from paths such as CA has been neglected), as shown in Figure 2.

![Figure 2](/assets/20220404/2022-04-06-17-27-40.png)

**Figure 2** The electron wave illustrated in two cases passing through a specimen. The wave passing through the centre of an atom (where the potential is high) has its wavelength reduced and so suﬀers a phase advance relative to the wave passing between the atoms, which experiences little change in its wavelength. The assumption of this simpliﬁed model, used in the phase grating approximation, is that the amplitude at A can be calculated along the optical path AB with no contribution at A from a point such as C. For thick specimens this approximation is unsatisfactory.

### Simple lens properties

At the high magniﬁcations usually used for high-resolution microscopy, **the lens currents (which determine the focal lengths) of lenses L2, L3, and L4**, for example, might be used to control the magniﬁcation. For a ﬁxed magniﬁcation setting, focusing is achieved by adjusting the strength of the objective lens L1 until the ﬁxed plane P1 is conjugate to the exit face of the specimen.

```mermaid!
	graph LR
	A(Lens currents of L2, L3 and L4) --> B(Focal lengths) --> C(Control the magnifications)
	 --> G(Fixed  magnifications)
	M(Fixed magnifications)-->D(Lens currents of object lens L1) --> E(P1 is conjugate to the exit face of the specimen) --> F(Focusing)
```
![Figure 3](/assets/20220404/2022-04-06-222144.png)

**Figure 3** Ray diagram for an electron microscope with two condenser lenses, C1 and C2 and four imaging lenses, L1, L2, L3, and L4, operating at high magniﬁcation. A typical set of dimensions for D1 to D7 is given in Table 1, together with the possible range of focal lengths. These values may be used for examples throughout this book. Here OA is the objective aperture, P1 is a ﬁxed plane, and SA is the selected area aperture.

| Distances btween lens centres (approximate) (mm) | Focal length range (mm) |
|--------------------------------------------------|-------------------------|
| D1 = 143.6                                       | 1.65 < f(C1) < 19       |
| D2 = 94.3                                        | 30 < f(C2) < 1060       |
| D3 = 251.4                                       | 15.4 < f((L2) < 281     |
| D4 = 215.5                                       | 3.1 < f((L3) < 99.5     |
| D5 = 44.9                                        | 2.06 < f(L4) < 16.4     |
| D6 = 73.6                                        |                         |
| D7 = 345.6                                       |                         |

**Table 1.** Electron-optical data for a typical electron microscope. For magniﬁcations greater than 100 000 the magniﬁcation is controlled by adjusting the focal length of L3 with f(L2) = 15.4 mm ﬁxed and f(L4) = 2.1 mm ﬁxed. The focal length of L3 is set as follows: f(L3) = 9.8, 7.0, 5.0, 3.1 mm for M = 150, 200, 400, 750 K, respectively.

> Why to study electron optics, seeks to determine the conditions under which the electron waveﬁeld passing through an electron lens satisﬁes the requirements for perfect image formation.

#### The ideal lens

The ideal lens is a mathematical abstraction which provides perfect imaging given by a projective transformation between the object and image space.

The constants appearing in this transformation specify the positions of the cardinal planes of the lens. The six important cardinal planes are the two focus planes, the two principal planes, and the two nodal planes.

```mermaid!
graph LR
A(Six important cardinal planes) --> B(two focus planes)
A --> C(two principal planes)
A --> D(two nodal planes)
```

![Figure 4](/assets/20220404/2022-04-06-231108.png)

**Figure 4.** The thick lens. The nodal planes (N1, N2), principal planes (H1, H2), and focal planes (F1, F2) are shown together with the lens focal lengths ($f_i$, $f_0$)and the object focal distance $z_p$ . For a magnetic electron lens the principal planes are crossed.

|---|---|---|---|---|---|---|---|
| ♜ |   | ♝ | ♛ | ♚ | ♝ | ♞ | ♜ |
|   | ♟ | ♟ | ♟ |   | ♟ | ♟ | ♟ |
| ♟ |   | ♞ |   |   |   |   |   |
|   | ♗ |   |   | ♟ |   |   |   |
|   |   |   |   | ♙ |   |   |   |
|   |   |   |   |   | ♘ |   |   |
| ♙ | ♙ | ♙ | ♙ |   | ♙ | ♙ | ♙ |
| ♖ | ♘ | ♗ | ♕ | ♔ |   |   | ♖ |

