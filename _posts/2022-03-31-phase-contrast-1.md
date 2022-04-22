---
layout: post
title: TEM 准备知识
date: 2022-03-31 15:57:55:24.000000000 +09:00
tags: TEM
---

参考 John C. H. Spence 著作的 《High-Resolution Electron Microscopy》(Fourth Edition, Oxford university press)。

<!-- TOC GFM -->

* [像差 TEM 成像的基本原理](#像差-tem-成像的基本原理)
	- [一个简单的光学台架实验](#一个简单的光学台架实验)
	- [如何提高衬度](#如何提高衬度)
	- [The Reason why Coherent but not Incoherent Illumination](#the-reason-why-coherent-but-not-incoherent-illumination)
	- [How to Increase Coherent in TEM](#how-to-increase-coherent-in-tem)
* [Instrumental Requirement for high resolution](#instrumental-requirement-for-high-resolution)

<!-- /TOC -->

## 像差 TEM 成像的基本原理

### 一个简单的光学台架实验

这里介绍一个记录成像的光学台架实验

![Figure 1](/assets/2022-03-31/20220331_1.png)

**图1.** 图中是一个用于记录成像的光具座装置。其中 $L1$ 是一个 $\times40$ 显微镜物镜，其焦点处放置了一个针孔光圈（aperture） $P$ 。透镜 $L2$ 以及 $L3$ 的焦距为 $f_{0}=$ 14 cm。物体在 $O$ 处显示，成像平面在 $F$ 处； 距离 $Y=$ 30 cm，$U =$ 17cm，而 $V=$ 80cm。针孔光圈起到空间滤波器（spatial filter）的作用，以提供更加均匀一致的光照。可在 $M$ 处插入后焦平面（back-focal plane）的掩模（masks）。
{: style="text-align: center;"}

![Figure 2](/assets/2022-03-31/2022-03-31_2.png){: height= "450"}

**图2.** 光学通过焦点系列显示焦点变化对于玻璃板中的一个小凹槽（相位对象）的成像影响。（a）中图像为欠焦（under-focus）情况下拍摄的，即物体与 $L3$ 透镜太近了。欠焦时，凹槽周围又一圈明亮的边缘（fringe），类似于小孔的电子显微经照片中观察到的边缘。（b）为精确对焦的情况，显示出非常微弱的衬度。（c）为过焦（over-focus）设置下的情况，即物体离 $L3$ 太远，因此在凹槽周围显现出黑色的菲涅尔条纹（Fresnel fringe）。图中可以看到照明系统所引起的背景条纹。
{: style="text-align: center;"}


下图3展示了与图2中相同的物体在传统的钨灯泡光源下成像的情况，作为**非相干光源**条件。尽管在实验中对焦值进行了大范围调整，对比对度依旧很差。

![Figure 3](/assets/2022-03-31/2022-04-01-16-53-33.png) {: height= "150"}

**图3.** 采用与图2(a)中相同的条件显示图像，其中光源替换为对焦在物体上的钨灯泡临界照明（critical illumination）。图中看到的微弱的衬度，是由于限制了透镜 $L2$ 的尺寸而是使得引入的照明保留了一些相干性。如果使用大镜头会使得衬度完全消失。该透镜（或其附近的光圈）大小的变化类似于电子显微镜中聚光镜（condensor）光圈大小的变化。注：临界照明指一类适用于小投影物的聚光系统，聚光镜将光源的像成在投影物上或它的附近，如放映机、幻灯机等。
{: style="text-align: center;"}

以上两个实验结果表明了：

高分辨率的样品如果要获得强衬度，只有通过以下两种方法：

1. 使用相关光源。
2. 以轻微欠焦的模式记录成像。

### 如何提高衬度

1. **缩小物镜光圈的大小。**

	Not useful, since image resolution is necessarily limited, as seen in Figure 4.
	并不实用，因为会影响图像的分辨率，而图像分辨率往往很有限，如图4。

	![Figure 4](/assets/2022-03-31/2022-04-01-10-46-56.png)

	**图4.** 在光轴 $M$ 处放置一个小光圈，严重的限制了图像的分辨率。当移除此光圈，图像的衬度消失。在后焦平面 $M$ 点处使用小光圈类似于在生物电子显微镜中获得衬度的正常低分辨率方法。
	{: style="text-align: center;"}

2. **引入聚焦"错误"**，如图2(a)所示。

3. **对后焦平面透镜的简单干预**，如下图5所示，其中显示了纹影衬度（Schlieren contrast），后焦平面大约是电子显微镜物镜光圈的平面。
, where Schlieren contrast is shown (the back-focal plane is approximately the plane of the objective aperture for an electron microscope).**

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

## Instrumental Requirement for high resolution

A laboratory which has recently purchased a TEM and wishes to use it for high-resolution studies should consider the following points.

1. The microscope site must be acceptable. Mechanical vibration, stray magnetic ﬁelds, and room temperature must all be within acceptable limits.
2. A reliable supply of clean cooling water at constant temperature and pressure must be assured.
3. In addition, **the spherical aberration constant Cs must be known** for the optimum objective lens excitation. This should be less than 2 mm at 100 kV if high-resolution results are expected.
4. The specimen position, for many lens designs the chromatic aberration coeﬃcient Cc passes through a minimum as a function of lens excitation, and this parameter aﬀects both the contrast and resolution of ﬁne image detail.
	* The complicated interaction between all these factors which depend on specimen position can best be understood using the ‘damping envelope’, This ‘damping envelope’ controls the information resolution limit (loosely referred to by manufacturers as the ‘line’ or ‘lattice’ resolution) of the instrument and depends chiefly on the size of the illumination aperture and Cc.
	* The point resolution, however, is determined by **spherical aberration**. A method has been described which would **allow both these important resolution limits to be measured as a function of specimen position in the lens** bore through an analysis of optical diﬀractogram pairs
5. A vacuum of 0.5 × 10−7 Torr or better is needed.
6. The high-voltage supply of the microscope must be suﬃciently stable to allow high-resolution images to be obtained.
7. The room containing the microscope must be easily darkened completely, and a room-light dimmer control needs to be ﬁtted within arm’s reach of the operator’s chair.





