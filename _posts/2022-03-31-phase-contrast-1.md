---
layout: post
title: Elementary principles of phase-contrast TEM imaging
date: 2022-03-31 15:57:55:24.000000000 +09:00
tags: cryo-EM
---

All contents are summarised from High-Resolution Electron Microscopy (Fourth Edition, Oxford university press) of John C. H. Spence.

<!-- TOC GFM -->

- [A Simple Optical Bench Experiment](#a-simple-optical-bench-experiment)
- [Discussion about How to Increase Contrast](#discussion-about-how-to-increase-contrast)
- [The Reason why Coherent but not Incoherent Illumination](#the-reason-why-coherent-but-not-incoherent-illumination)
- [How to Increase Coherent in TEM](#how-to-increase-coherent-in-tem)

<!-- /TOC -->

### A Simple Optical Bench Experiment

Here is the optical bench arrangement to record the images:

![The optical bench arrangement to record the images](/assets/2022-03-31/20220331_1.png)

**Figure 1.** Here L1 is a ×40 microscope objective lens at the focus of which is placed a pin-hole aperture P. Lenses L2 and L3 have a focal length of f0 = 14 cm. The object is shown at O and the film plane at F; distances are Y =30cm, U = 17 cm, and V = 80 cm. The pin-hole aperture is used as a spatial filter to provide more uniform illumination. Back-focal plane masks may be inserted at M.

![Figure 2](/assets/2022-03-31/2022-03-31_2.png)

**Figure 2.** Optical through-focus series showing the effect of focus changes on the image of a small indentation in a glass plate (phase object). The image at (a) was recorded under-focus, that is, with the object too close to the lens L3. It shows a bright fringe surrounding the indentation similar to that seen on electron micrographs of small holes; image (b) is recorded at exact focus and shows only very faint contrast; image (c\) is recorded at an over-focus setting (object too far from L3) and so shows a dark Fresnel fringe outlining the indentation. The background fringes arise in the illuminating system.

The result sugested:

High-resolution specimens will be imaged with strong contrast only if a **coherent source of illumination is used (if not see Figure 3)** and if **images are recorded slightly out of focus (defocus)**.

Figure 3 shows the same object imaged using a conventional tungsten lamp-bulb as the source of illumination to provide ***‘incoherent’*** illumination conditions. **Despite wide changes in focus, little contrast appears**.

![Figure 3](/assets/2022-03-31/2022-04-01-16-53-33.png) 

**Figure 3.** An image recorded under identical conditions to that shown in Figure 2(a), with the laser source replaced with a tungsten lamp focused onto the object (critical illumination). The faint contrast seen is due to the preservation of some coherence in the illumination introduced by limiting the size of lens L2. This contrast disappears completely if a large lens is used. Variations in the size of this lens (or an aperture near it) are analogous to changes in the size of the second condenser aperture in an electron microscope.

### Discussion about How to Increase Contrast

1. **Reducing the size of the objective aperture.**

	Not useful, since image resolution is necessarily limited, as seen in Figure 4.

	![Figure 4](/assets/2022-03-31/2022-04-01-10-46-56.png)

	**Figure 4.** A small aperture has been placed on the axis at M, **severely limiting the image resolution**. On removing this aperture the image contrast disappears. The use of a small aperture at M (the back-focal plane) is analogous to the normal low-resolution method of obtaining contrast in biological electron microscopy.

2. **Introducing a focusing error as in Figure 2(a).**

3. **Simple interventions in the lens back-focal plane as in Figure 5, where Schlieren contrast is shown (the back-focal plane is approximately the plane of the objective aperture for an electron microscope).**

	![Figure 5](/assets/2022-03-31/2022-04-01-17-00-41.png) 

	**Figure 6.** A razor blade has been placed across the beam at M, thus preventing exactly half the diﬀraction pattern from contributing to the image. The resulting image is approximately proportional to the derivative of the phase shift introduced by the object taken in a direction normal to the edge of the razor blade. Notice the fine fringes inside the edge of the indentation arising from multiple reflection within the glass slide.

4. **the use of back-focal plane phase plates, similar to the Zernike phase plate used in optical microscopy.**

	Phase plates for TEM can be divided into two groups by the symmetry of the modulation pattern they produce:
	<br>
	1. Zernike type phase plate, generate circularly symmetric modulation pattern. The images produced using such phase plates exhibit **isotropic contrast features** around objects.
	2. Hilbert type, these devices modulate the diffracted wave asymmetrically **giving rise to anisotropic contrast** in the images.
	<br>

	![Figure 7](/assets/2022-03-31/PhasePlate.jpg)

	**Figure 7.** Different kinds of phase plates
	
	![Fgure 8](/assets/2022-03-31/2022-04-02-15-42-41.png)

	**Figure 8.** (A) Optical layout of a transmission electron microscope equipped with a Zernike phase plate. (B) Moduli of phase contrast transfer functions without (solid line) and with (dashed line) a Zernike phase plate. kCO is the cut-on frequency ofthe phase plate; Parameters: defocus 0, spherical aberration 5 mm, acceleration voltage 300 kV.

	![Figure 9](/assets/2022-03-31/2022-04-02-16-04-42.png)

	**Figure 9.** Images of ice-embedded T4 bacteriophage. (A) Defocus phase contrast image, defocus 1.6 mm. (B) Zernike phase contrast image close to focus. (C) and (D) moduli of the Fourier transforms of the images in (A) and (B) respectively. White arrows in (C) indicate the first two zeros ofthe contrast transfer function. Black arrows in (C) and (D) indicate the ring corresponding to the 2.3 nm periodicity of the DNA packed in the phase capsids. Experimental conditions: acceleration voltage 200 kV, electron dose 20 e /A˚2. Scale bars: 50 nm.
	
### The Reason why Coherent but not Incoherent Illumination

In both electron and optical microscopy the reasons for the lack of contrast at exact focus are the same—these thin specimens (‘phase objects’) affect only the phase of the wave transmitted by the specimen and not its amplitude.

That is, they behave like **a medium of variable refractive index**. It is this variation in refractive index from point to point across the specimen (proportional to the specimen’s atomic potential in volts 6 Preliminaries for electron microscopy) which must be converted into intensity variations in the image if we are to ‘see’, for example, atoms in the electron microscope

For the piece of glass shown in Fig. 1.2, the phase of the wave transmitted through the glass differs from that of an unobstructed reference wave by 2π(n − 1)/λ times the thickness of the glass, where n is the refractive index of the glass.

The amplitude of the optical wave leaving the glass is given from elementary optics can be described as,

$$
f(x) = \exp(-2\pi int(x)/\lambda) \tag{1}
$$

in which, the t(x) represented the thickness of the glass at the object point $x$ , and $n$ is the refractive index of the glass. And for coherent illumination,

$$
I(x)_c = |f(x) * S(x)|^2 \tag{2}
$$

which for the incoherent illumination,

$$
I(x)_i = |f(x)|^2 * |S(x)|^2 \tag{3}
$$

**Where $S(x)$ specifies all the instrumental imperfections and parameters** such as objective aperture size (which determines the diffraction limit), the lens aberrations, and the magnitude of any focusing error. **And $f(x)$ represents the object function**.

From the $(1)(2)$ and $(3)$ we can find in the incoherent lumination, the image intensity from such a phase object does not vary with position in the object, since

$$
|\exp{-2\pi i t(x) n/\lambda}|^2 = 1
$$

And Here is the Conclusion:

1. Only by using coherent illumination and an ‘imperfect’ microscope can we hope to obtain contrast variations in the image of a specimen showing only variations in refractive index. 
2. **In high-resolution electron microscopy of thin specimens the accurate control of illumination coherence and defect of focus are crucial for success**. 
3. The amount of fine detail in a high-resolution TEM micrograph increases dramatically with improved coherence of illumination, while completely misleading detail may be observed in images recorded at the wrong focus setting.

### How to Increase Coherent in TEM

In practice, for a microscope ﬁtted with a conventional hair-pin ﬁlament, **the illumination coherence is determined by the size of the second condenser lens aperture, a small aperture producing high coherence**. As shown in Figure 10.

![Figure 10](/assets/2022-03-31/2022-04-04-173305.png)

**Figure 10.** Two electron microscope images of amorphous carbon ﬁlms recorded at the same focus setting but using diﬀerent condenser apertures. In (a) a small second condenser aperture has been used, resulting in an image showing high contrast and ﬁne detail. This contrast is lost in (b), where a large aperture has been used.

In most cases of practical interest the imaging is partially coherent. By this we loosely mean that for object detail below a certain size $X_c$ we can use the model of coherent phase contrast imaging (see Fig. 1.2) while for detail much larger than $X_c$ the imaging is incoherent.

The distance **$X_c$ is given approximately by the electron wavelength divided by the semi-angle subtended by the second condenser aperture at the specimen**, when using a hair-pin ﬁlament.

