import ExpoModulesCore
import GoogleSignIn

// Returns Google's ID token and its paired access token (Supabase verifies the
// ID token's at_hash against it). The caller passes SHA-256(raw nonce); Supabase
// receives the raw nonce and verifies it against the token's nonce claim.
public class GoogleNativeSignInModule: Module {
  public func definition() -> ModuleDefinition {
    Name("GoogleNativeSignIn")

    AsyncFunction("signIn") { (clientId: String, hashedNonce: String, promise: Promise) in
      guard let presenter = self.appContext?.utilities?.currentViewController() else {
        promise.reject("ERR_NO_PRESENTER", "No view controller is available.")
        return
      }
      let signIn = GIDSignIn.sharedInstance
      signIn.configuration = GIDConfiguration(clientID: clientId)
      // Always show the account chooser instead of silently reusing a prior Google user.
      signIn.signOut()
      signIn.signIn(
        withPresenting: presenter,
        hint: nil,
        additionalScopes: nil,
        nonce: hashedNonce
      ) { result, error in
        if let error = error as NSError? {
          if error.domain == kGIDSignInErrorDomain && error.code == GIDSignInError.canceled.rawValue {
            promise.reject("ERR_CANCELED", "Google sign-in was canceled.")
          } else {
            promise.reject("ERR_GOOGLE_SIGN_IN", "Google sign-in failed.")
          }
          return
        }
        guard let user = result?.user, let idToken = user.idToken?.tokenString else {
          promise.reject("ERR_NO_ID_TOKEN", "Google did not return an ID token.")
          return
        }
        promise.resolve(["idToken": idToken, "accessToken": user.accessToken.tokenString])
      }
    }.runOnQueue(.main)

    AsyncFunction("signOut") {
      GIDSignIn.sharedInstance.signOut()
    }.runOnQueue(.main)
  }
}
