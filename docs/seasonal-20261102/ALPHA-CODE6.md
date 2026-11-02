# Alpha code6 release evidence — 2 November 2026

## Source and artifact

- Focused PR #27 merged to main: `91c17302ccf56ee766aeccd68f9c520be67e4f7a`.
- EAS snapshot: `5639a1f06e8fd4baa04c92f904bbbc2492259601`; runtime/config/assets/dependency diff against that main is empty.
- EAS build: `a085a6d3-5bce-4679-8227-bfd9060c50ee`, finished, `ads-closed-test`.
- Android package `com.kovynelstudio.anlaezberle`, versionName `0.1.0`, versionCode `6`.
- AAB SHA256 `5e6c0ab511d60466d3c3662642262e193f4b3d7b62c75e6616866f47005bace4`.
- Existing upload certificate SHA256 `6df507f045b6d7fee9147153cf815b36a0c4b072f2b55b6dcd6dda54486352b7` unchanged.
- Min SDK24 / target36, non-debuggable; bundle validation, signature, all52 64-bit native ELF16KB alignment and16KB bundle page alignment passed. Existing permissions retained.
- AAB-derived QA APK SHA256 `cbd6ceea4cf8b7a79cde4dedf0bb047d2cad49baf38be2f054e65bf7a4888a7f` installed over the existing debug QA app without data reset. Actual Android14 catalogue and invalid seasonal link guard passed. This is not a Play-signed/physical-device test.

## Console operation and observed state

Existing Alpha only: track `4700576532370978005`, release `3`.
The uploaded code6 package was accepted. The final preview showed no blocking
errors and zero lost supported devices. Release name:
`0.1.0 (6) - Sezonluk kart düzenlemesi`.

The owner-authorized review submission was confirmed. The publishing overview
now lists this single Alpha change under **İncelenmekte olan değişiklikler**;
The automatic checks have now completed and the Console explicitly states
'Changes are currently being reviewed'. Do not equate this with tester availability.
Managed publishing remains off, so accepted review can release to existing Alpha.
No tester list, country selection, Google Groups channel or Production changed.

The track's freshest pre-submission observation showed code5 available to
selected testers since1 November21:18. The earlier stored code5 under-review
observation is historical and superseded by that track view.

## Content boundary

Code6 includes the seasonal-card change and retains main's20-second rules,
progressive XP, Auth, notification and approved logo changes. It does not ship
the separate Apple erasure/moderation candidate PR #26. Real ads and Analytics
remain disabled. Approval/build gates were reclosed after this one snapshot.

Code6 review completion and actual Play delivery remain to be verified.
No new TestFlight build is distributed while required security acceptance is open.
