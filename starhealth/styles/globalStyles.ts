import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 14,
    color: '#CFCFCF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },

  input: {
    backgroundColor: 'rgba(28,28,60,0.8)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 18,
    color: '#fff',
  },

  primaryButton: {
    backgroundColor: '#d45425',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#ccc',
    fontSize: 14,
  },
});
