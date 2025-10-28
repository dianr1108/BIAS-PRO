import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: October 24, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                BIAS (Behavioral Intelligence Audit System) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our analytics platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium mb-2 mt-4">2.1 Public TikTok Data</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We collect publicly available TikTok data through official APIs, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Profile information (username, bio, follower count, following count)</li>
                <li>Video metrics (video count, total likes, engagement rates)</li>
                <li>Public content performance data</li>
                <li>Trending hashtags and sounds</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">2.2 Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may collect anonymous usage data including browser type, device information, and platform interactions to improve our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">We use collected data to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Generate behavioral analytics and performance insights</li>
                <li>Provide AI-powered content recommendations</li>
                <li>Display trending data and competitor comparisons</li>
                <li>Improve our analytics algorithms and platform features</li>
                <li>Ensure platform security and prevent abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                Currently, BIAS uses in-memory storage for analysis data. We implement industry-standard security measures to protect data during processing. We do not sell, trade, or transfer your data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
              
              <h3 className="text-lg font-medium mb-2 mt-4">5.1 TikTok API</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use TikTok's official Display API to access public profile data. Your use of BIAS is also subject to TikTok's Privacy Policy and Terms of Service.
              </p>

              <h3 className="text-lg font-medium mb-2 mt-4">5.2 AI Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use Google Gemini AI to generate insights and recommendations. No personal data is shared with AI services beyond what is necessary for analysis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                BIAS may use cookies and similar tracking technologies to enhance user experience. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Analysis data is stored temporarily in memory for the duration of your session. We do not permanently store personal TikTok profile data unless explicitly required for features you have opted into.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Request information about data we have collected</li>
                <li>Request deletion of your analysis history</li>
                <li>Opt-out of data collection by discontinuing use of the service</li>
                <li>Update or correct any inaccurate information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                BIAS is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of BIAS after changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions or concerns about this Privacy Policy, please contact us through our platform at bias23.replit.app or via the AI Discussion feature.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                BIAS complies with applicable data protection laws and regulations. We are committed to protecting your privacy and handling data responsibly in accordance with industry best practices.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
