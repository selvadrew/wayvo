import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView
} from "react-native";
import { connect } from "react-redux";

class Terms extends Component {
  static navigatorStyle = {
    navBarHidden: false,
    navBarTextFontSize: 20,
    navBarBackgroundColor: "#EEE",
    //statusBarColor: "#EEE"
    navBarButtonColor: "#000"
  };
  constructor(props) {
    super(props);
  }

  render() {
    let statusBar = null;
    if (Platform.OS === "ios") {
      statusBar = <StatusBar barStyle="dark-content" backgroundColor="#EEE" />;
    }
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        {statusBar}
        <Text style={styles.title1}>Terms of Use</Text>
        <Text style={styles.title4}>
          These Terms govern your use of Wayvo and the software we offer.
        </Text>
        <Text>{"\n"}</Text>
        <Text style={styles.title2}>
          Your Commitments to Wayvo and Our Users
        </Text>
        <Text style={styles.title4}>
          We provide these services to you and others to help advance our
          mission of connecting people through conversation. In exchange, we
          need you to make the following commitments:
          {"\n"}
        </Text>
        <Text style={styles.title3}>When you use Wayvo, you must:</Text>
        <Text style={styles.title4}>
          {"\u2022"} Provide accurate information about yourself.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"} Create only one account (your own) and use the app for
          personal purposes.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"} Not share your password, give access to your Wayvo account
          to others, or transfer your account to anyone else (without our
          permission).
          {"\n"}
        </Text>
        <Text style={styles.title3}>The Permissions you give us: </Text>
        <Text style={styles.title4}>
          {"\u2022"} Permission to update software you use or download: If you
          download or use our software, you give us permission to download and
          install upgrades, updates, and additional features to improve,
          enhance, and further develop it.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"} If we determine that you have violated our terms or
          policies, we may take action against your account to protect our users
          and services, including by suspending access to your account or
          disabling it. We may also suspend or disable your account if you
          create risk or legal exposure for us or when we are permitted or
          required to do so by law. Where appropriate, we will notify you about
          your account the next time you try to access it.
          {"\n"}
        </Text>
        <Text style={styles.title3}>Limits on liability</Text>
        <Text style={styles.title4}>
          {"\u2022"} We work hard to provide the best app we can and to specify
          clear guidelines for everyone who uses them. Our app, however, are
          provided "as is," and we make no guarantees that they always will be
          safe, secure, or error-free, or that they will function without
          disruptions, delays, or imperfections. To the extent permitted by law,
          we also DISCLAIM ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING
          THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, TITLE, AND NON-INFRINGEMENT. We do not control or direct what
          people and others do or say, and we are not responsible for their
          actions or conduct (whether online or offline) or any content they
          share (including offensive, inappropriate, obscene, unlawful, and
          other objectionable content).
        </Text>
        <Text style={styles.title4}>
          {"\u2022"} We cannot predict when issues might arise with our app.
          Accordingly, our liability shall be limited to the fullest extent
          permitted by applicable law, and under no circumstance will we be
          liable to you for any lost profits, revenues, information, or data, or
          consequential, special, indirect, exemplary, punitive, or incidental
          damages arising out of or related to these Terms, even if we have been
          advised of the possibility of such damages.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"} We are not responsible for any charges or overages you may
          experience with your cellular network provider when contacts on Wayvo
          call your mobile number.
          {"\n"}
        </Text>
        <Text style={styles.title3}>Disputes</Text>
        <Text style={styles.title4}>
          {"\u2022"} We try to provide clear rules so that we can limit or
          hopefully avoid disputes between you and us. If a dispute does arise,
          however, it's useful to know up front where it can be resolved and
          what laws will apply.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"} If you are a consumer, the laws of the country in which you
          reside will apply to any claim, cause of action, or dispute you have
          against us that arises out of or relates to these Terms, and you may
          resolve your claim in any competent court in that country that has
          jurisdiction over the claim. In all other cases, you agree that the
          claim must be resolved exclusively in the U.S. District Court for the
          Northern District of California or a state court located in San Mateo
          County, that you submit to the personal jurisdiction of either of
          these courts for the purpose of litigating any such claim, and that
          the laws of the State of California will govern these Terms and any
          claim, without regard to conflict of law provisions.
        </Text>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>

        <Text style={styles.title1}>Data Policy</Text>
        <Text style={styles.title4}>
          This policy describes the information we process to support Wayvo, and
          features offered by Wayvo.
        </Text>
        <Text>{"\n"}</Text>
        <Text style={styles.title2}>
          What kinds of information do we collect?
        </Text>
        <Text style={styles.title4}>
          To provide our services and improve our platform, we must process
          information about you. The types of information we collect depend on
          how you use our app.
          {"\n"}
        </Text>
        <Text style={styles.title4}>
          {"\u2022"}{" "}
          <Text style={{ fontWeight: "bold" }}>
            Information and content you provide.
          </Text>{" "}
          The only personal information we collect about you is your name,
          Facebook profile picture, email, and phone number. Your name, Facebook
          profile picture, and email are collected when you click the “Continue
          with Facebook” button via our Facebook integration.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"}{" "}
          <Text style={{ fontWeight: "bold" }}>Contacts on the Wayvo App.</Text>{" "}
          We collect information about your contact list from the Wayvo app and
          how often you connect with them.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"} <Text style={{ fontWeight: "bold" }}>Your usage.</Text> We
          collect information about how you use our products, such as the types
          of content you view or engage with; the features you use; the actions
          you take; the people or accounts you interact with; and the time and
          frequency of your activities. For example, we log when you have last
          used our app.
        </Text>

        <Text style={styles.title2}>
          {"\n"}
          How do we use this information?
        </Text>

        <Text style={styles.title4}>
          {"\u2022"} <Text style={{ fontWeight: "bold" }}>Personal Data</Text>{" "}
          We do not share or sell any of your personal data (name, profile
          picture, phone number, email, and usage data) with third parties or to
          show you ads. We only share this data with other Wayvo users when you
          allow us to - when you add them as a contact or accept their contact
          request.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"}{" "}
          <Text style={{ fontWeight: "bold" }}>
            Product research and development.{" "}
          </Text>{" "}
          We use the information we have to develop, test and improve our
          Products, including by conducting surveys and research, and testing
          and troubleshooting new features.
        </Text>
        <Text style={styles.title4}>
          {"\u2022"}{" "}
          <Text style={{ fontWeight: "bold" }}>
            Ads and other sponsored content.
          </Text>{" "}
          We do not sell your data to third parties or use your data to show you
          ads.
        </Text>
        <Text style={styles.title2}>
          {"\n"}
          How will we notify you of changes to this policy?
        </Text>
        <Text style={styles.title4}>
          We'll notify you before we make changes to this policy and give you
          the opportunity to review the revised policy before you choose to
          continue using Wayvo.
        </Text>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>
        <Text>{"\n"}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center"
    padding: 10,
    backgroundColor: "#fff"
  },
  title1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    textDecorationLine: "underline",
    marginBottom: 5
  },
  title2: {
    fontSize: 20,
    color: "#222",
    fontWeight: "bold"
  },
  title3: {
    fontSize: 18,
    color: "#222",
    fontWeight: "bold"
  },
  title4: {
    fontSize: 15,
    color: "#222"
  }
});

export default Terms;
