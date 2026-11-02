# Apple Developer Support — onaylanan ve gönderilen teknik başvuru

Subject: External TestFlight Beta App Review blocked with HTTP 422 ENTITY_UNPROCESSABLE

Hello Apple Developer Support,

We cannot submit our first external TestFlight beta for review. The build is uploaded and processed, and App Store Connect shows Ready to Submit. Both the external group Add Builds flow and the build details Add Group flow fail at Submit for Review.

App: Anla & Ezberle: İslami Quiz
App Apple ID: 6829516832
Bundle ID: com.kovynelstudio.anlaezberle
Developer Team ID: W7CRC43SHP
Build: 0.1.0 (4)
Build ID: 746dd05e-19cb-4f00-b38b-e9b994fc5a12
Upload: 2 November 2026, 19:04 Europe/Istanbul; Xcode upload succeeded.
External group: Anla & Ezberle Public Beta
Group ID: 43dcf44c-f097-47a9-85a5-fa4b303b0a8a

Observed UI error: There was an error processing your request. Please try again later.
The failed POST betaAppReviewSubmissions returned HTTP 422. We inspected only its response in Chrome DevTools:

```json
{"errors":[{"id":"d0da9b00-1fe6-419c-837b-5d98fbdc1d44","status":"422","code":"ENTITY_UNPROCESSABLE","title":"There was an error processing your request.","detail":"Please try again later."}]}
```

Beta description, feedback email, privacy URL, review contact fields, private reviewer sign-in fields, review notes and What to Test are saved. Required fields were rechecked without disclosing the credentials. The Free Apps Agreement is Active (1 November 2026–1 November 2027). No pending free-app agreement acceptance was shown. We did not accept or change the Paid Apps Agreement or DSA declarations, and are not requesting App Store Production distribution.

No review submission was accepted; the external group still has 0 builds / 0 testers. No public link is active. We have not deleted or expired builds or changed signing, bundle ID, security settings or existing testing groups to work around this error.

Please investigate this app/account's external TestFlight beta review eligibility and any missing backend contract or submission configuration. The error response does not provide a specific missing field or contract; we do not assume the cause. If necessary, please escalate to the App Store Connect/TestFlight engineering team.

Goal: submit this existing build for Beta App Review, then allow an Open to Anyone public TestFlight link limited to 1,000 testers. No App Store Production release is requested.

Thank you.

---
No password, token, cookie, private key or private contact data is included. Owner explicitly authorized this exact support request on 2 November 2026. It was submitted through Apple Developer Support > Distribution > TestFlight. The success receipt and Case ID were verified and retained in private local evidence; the Case ID and owner account/contact details are not committed here.
