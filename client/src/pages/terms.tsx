import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: October 24, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using BIAS (Behavioral Intelligence Audit System), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                BIAS is an analytics platform that provides behavioral intelligence insights for TikTok creators. We analyze public TikTok profile data to generate performance reports, growth strategies, and AI-powered recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Use of TikTok Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                BIAS uses TikTok's official Display API to access publicly available data including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Public profile information (username, bio, follower count)</li>
                <li>Public video metrics (likes, comments, shares, views)</li>
                <li>Publicly available engagement data</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We do NOT access private accounts, personal messages, or any non-public data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Users agree to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide accurate TikTok usernames for analysis</li>
                <li>Use the service for legitimate analytics purposes only</li>
                <li>Not attempt to reverse engineer or misuse the platform</li>
                <li>Comply with TikTok's Terms of Service and Community Guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Accuracy</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to provide accurate analytics, BIAS does not guarantee the completeness or accuracy of data provided by third-party APIs. All insights and recommendations are for informational purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of BIAS are owned by BIAS and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                BIAS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of BIAS after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us through our platform at bias23.replit.app.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
