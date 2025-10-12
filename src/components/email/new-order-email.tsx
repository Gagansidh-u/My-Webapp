
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Font
} from "react-email";
import * as React from "react";

interface OrderDetails {
  orderId: string;
  plan: string;
  price: number;
  duration: number;
  userEmail: string | null;
  userName: string | null;
  userId: string;
  websiteDetails: {
    description: string;
    colors: string;
    style: string;
  };
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const getDurationText = (duration: number) => {
    if (!duration) return 'N/A';
    if (duration < 12) return `${duration} Month${duration > 1 ? 's' : ''}`;
    const years = duration / 12;
    return `${years} Year${years > 1 ? 's' : ''}`;
}

export const NewOrderEmail = ({
  orderId,
  plan,
  price,
  duration,
  userEmail,
  userName,
  userId,
  websiteDetails,
}: OrderDetails) => (
  <Html>
    <Head>
      <Font
        fontFamily="Poppins"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2",
          format: "woff2",
        }}
        fontWeight={700}
        fontStyle="normal"
      />
      <Font
        fontFamily="PT Sans"
        fallbackFontFamily="Arial"
        webFont={{
          url: "https://fonts.gstatic.com/s/ptsans/v17/jizaRExUiTo99u79D0-ExdGM.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>New Order Received: {plan} Plan</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
            <Heading style={heading}>Grock Technologies</Heading>
        </Section>
        <Text style={title}>
            New Order Received!
        </Text>
        <Section style={card}>
            <Heading as="h2" style={cardHeader}>
              Order ID: #{orderId}
            </Heading>
            <Hr style={hr} />
            <Section style={cardContent}>
                <Text style={paragraph}>A new order has been placed successfully.</Text>
                
                <Heading as="h3" style={subHeading}>Customer Details</Heading>
                <Text style={detailItem}><strong>Customer:</strong> {userName}</Text>
                <Text style={detailItem}><strong>Email:</strong> {userEmail}</Text>
                <Text style={detailItem}><strong>User ID:</strong> {userId}</Text>

                <Heading as="h3" style={subHeading}>Order Summary</Heading>
                <Text style={detailItem}><strong>Plan:</strong> {plan}</Text>
                <Text style={detailItem}><strong>Billing Cycle:</strong> {getDurationText(duration)}</Text>
                <Text style={{...detailItem, fontWeight: "bold"}}><strong>Total Price:</strong> ₹{price.toFixed(2)}</Text>

                <Heading as="h3" style={subHeading}>Website Requirements</Heading>
                <Text style={detailItem}><strong>Description:</strong> {websiteDetails.description}</Text>
                <Text style={detailItem}><strong>Colors:</strong> {websiteDetails.colors}</Text>
                <Text style={detailItem}><strong>Style/Vibe:</strong> {websiteDetails.style}</Text>
            </Section>
             <Hr style={hr} />
             <Section style={cardContent}>
                <Link href={`${baseUrl}/admin/orders`} style={button}>
                    View Order in Admin Panel
                </Link>
             </Section>
        </Section>
        <Text style={footer}>
          © {new Date().getFullYear()} Grock Technologies. All Rights Reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewOrderEmail;

const main = {
  backgroundColor: "#f0eaff",
  fontFamily: '"PT Sans", sans-serif',
  color: "#404040",
  padding: "24px",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const header = {
    textAlign: "center" as const,
    padding: "20px 0",
};

const heading = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#673AB7",
    margin: "0",
};

const title = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "16px 0",
    color: "#1a1a1a",
};

const card = {
    backgroundColor: "#ffffff",
    border: "1px solid #e6e6e6",
    borderRadius: "12px",
    overflow: "hidden",
};

const cardHeader = {
    padding: "24px 24px 12px",
    margin: "0",
    fontFamily: "Poppins, sans-serif",
    fontSize: "20px",
    color: "#1a1a1a",
};

const cardContent = {
    padding: "0 24px",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "16px",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 0",
};

const subHeading = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    margin: "24px 0 8px",
};

const detailItem = {
    ...paragraph,
    margin: "4px 0",
};

const button = {
    display: "inline-block",
    backgroundColor: "#673AB7",
    color: "#ffffff",
    fontFamily: "Poppins, sans-serif",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    margin: "16px 0",
};

const footer = {
  color: "#888888",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "24px",
};
