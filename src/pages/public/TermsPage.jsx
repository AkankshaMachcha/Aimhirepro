import React, { useEffect } from 'react';
import '../../assets/css/TermsPage.css';

const TermsPage = () => {
    useEffect(() => {
        document.title = 'Terms & Conditions | AimHirePro';
    }, []);

    return (
        <div className="terms-page container">
            <div className='terms-container'>
                <h1 className="mb-4 text-primary fw-bold">Terms & Conditions</h1>
                <p className="text-muted mb-5">
                    These Terms and Conditions govern your use of AimHirePro. By accessing or using our platform, you agree to be bound by these terms.
                </p>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">1. Acceptance of Terms</h4>
                    <p className="text-muted">
                        By accessing or using AimHirePro, you confirm that you have read, understood, and agree to be bound by these Terms.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">2. User Responsibilities</h4>
                    <p className="text-muted">
                        You are responsible for maintaining the confidentiality of your account and for all activities under your account.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">3. Account & Security</h4>
                    <p className="text-muted">
                        Users must provide accurate information and keep their credentials secure. We are not liable for unauthorized access.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">4. Payments and Subscriptions</h4>
                    <p className="text-muted">
                        Premium features may require payment. By purchasing, you agree to our billing terms and refund policies.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">5. Intellectual Property</h4>
                    <p className="text-muted">
                        All content, trademarks, and services on AimHirePro are our intellectual property and may not be reused without permission.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">6. Termination</h4>
                    <p className="text-muted">
                        We reserve the right to suspend or terminate your account for violations of our terms or inappropriate use.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">7. Limitation of Liability</h4>
                    <p className="text-muted">
                        We are not responsible for any direct or indirect damages arising from the use or inability to use our platform.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="fw-semibold mb-2">8. Governing Law</h4>
                    <p className="text-muted">
                        These Terms are governed by and construed in accordance with the laws of India.
                    </p>
                </section>

                <section className="mb-3">
                    <h4 className="fw-semibold mb-2">9. Contact Information</h4>
                    <p className="text-muted">
                        If you have any questions about these Terms, contact us at <strong>support@aimhirepro.com</strong>.
                    </p>
                </section>

                <p className="text-muted small mt-4">Last updated: July 21, 2025</p>
            </div>
        </div>
    );
};

export default TermsPage;
