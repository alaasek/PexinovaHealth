import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ChevronDown, ChevronUp } from 'lucide-react-native';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import PageHeader from '../components/PageHeader';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const FAQ_DATA = [
    { id: 1, question: "How do I reset my password?", answer: "Go to Security > Change Password to start the process." },
    { id: 2, question: "How do I delete my account?", answer: "In the Account screen, you'll find the option to delete your account at the bottom." },
    { id: 3, question: "How do I update my profile?", answer: "Visit the Account screen and tap on your details to edit them." },
    { id: 4, question: "Is my data secure?", answer: "Yes, we use industry-standard encryption to protect all your data." },
];

const FAQItem = ({ question, answer }: any) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <TouchableOpacity
            style={styles.faqItem}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
        >
            <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{question}</Text>
                {expanded ? <ChevronUp size={20} color={COLORS.textSecondary} /> : <ChevronDown size={20} color={COLORS.textSecondary} />}
            </View>
            {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
        </TouchableOpacity>
    );
};

export default function HelpScreen() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSendMessage = () => {
        if (subject && message) {
            setSent(true);
            setTimeout(() => setSent(false), 3000);
            setSubject('');
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <PageHeader title="Help" />
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
                    <GlassContainer style={styles.section}>
                        {FAQ_DATA.map((item, index) => (
                            <FAQItem
                                key={item.id}
                                question={item.question}
                                answer={item.answer}
                                showBorder={index !== FAQ_DATA.length - 1}
                            />
                        ))}
                    </GlassContainer>

                    <Text style={styles.sectionLabel}>SEND US A MESSAGE</Text>
                    <GlassContainer style={styles.section}>
                        <TextInput
                            style={styles.input}
                            placeholder="Subject"
                            placeholderTextColor={COLORS.textSecondary}
                            value={subject}
                            onChangeText={setSubject}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your issue..."
                            placeholderTextColor={COLORS.textSecondary}
                            multiline
                            numberOfLines={4}
                            value={message}
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, (!subject || !message) && styles.disabledButton]}
                            onPress={handleSendMessage}
                            disabled={!subject || !message}
                        >
                            <Send size={20} color={COLORS.text} style={styles.sendIcon} />
                            <Text style={styles.sendButtonText}>{sent ? "Message Sent!" : "Send Message"}</Text>
                        </TouchableOpacity>
                    </GlassContainer>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        padding: SPACING.m,
    },
    sectionLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontFamily: FONTS.medium,
        marginBottom: SPACING.s,
        marginLeft: SPACING.xs,
    },
    section: {
        marginBottom: SPACING.l,
        padding: SPACING.m,
    },
    faqItem: {
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.medium,
        flex: 1,
        marginRight: SPACING.m,
    },
    faqAnswer: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginTop: SPACING.s,
        lineHeight: 20,
        fontFamily: FONTS.regular,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: SPACING.m,
        color: COLORS.text,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        fontFamily: FONTS.regular,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    sendButton: {
        backgroundColor: COLORS.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.m,
        borderRadius: 12,
        marginTop: SPACING.s,
    },
    disabledButton: {
        opacity: 0.5,
    },
    sendIcon: {
        marginRight: SPACING.s,
    },
    sendButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
});
