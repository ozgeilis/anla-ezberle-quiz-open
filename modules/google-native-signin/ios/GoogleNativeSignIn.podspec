Pod::Spec.new do |s|
  s.name           = 'GoogleNativeSignIn'
  s.version        = '1.0.0'
  s.summary        = 'Native Google Sign-In with a caller-supplied nonce for Supabase ID token exchange.'
  s.author         = 'Kovynel Studio'
  s.homepage       = 'https://anla-ezberle-quiz.vercel.app'
  s.license        = { :type => 'UNLICENSED' }
  s.platforms      = { :ios => '16.4' }
  s.source         = { :path => '.' }
  s.static_framework = true
  s.swift_version  = '5.9'
  s.dependency 'ExpoModulesCore'
  s.dependency 'GoogleSignIn', '~> 10.1'
  s.source_files = '*.swift'
end
