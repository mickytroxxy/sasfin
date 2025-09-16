import { CustomGradient } from '@/components/CustomGradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useFinanceStore } from '@/store/financeStore';
import { calculateLoan } from '@/utils/financeUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoanCalculatorScreen() {
  const router = useRouter();
  const {
    loanAmount,
    loanInterestRate,
    loanTermMonths,
    loanResults,
    setLoanInputs,
    addLoanResult,
  } = useFinanceStore();

  const [amount, setAmount] = useState(loanAmount);
  const [rate, setRate] = useState(loanInterestRate);
  const [term, setTerm] = useState(loanTermMonths);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setAmount(loanAmount);
    setRate(loanInterestRate);
    setTerm(loanTermMonths);
  }, [loanAmount, loanInterestRate, loanTermMonths]);

  const handleCalculate = () => {
    const numAmount = parseFloat(amount);
    const numRate = parseFloat(rate);
    const numTerm = parseInt(term);

    if (isNaN(numAmount) || isNaN(numRate) || isNaN(numTerm) || numAmount <= 0 || numRate <= 0 || numTerm <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid positive numbers for all fields.');
      return;
    }

    const calculation = calculateLoan(numAmount, numRate, numTerm);
    setResult(calculation);
    setLoanInputs(amount, rate, term);
    addLoanResult({ ...calculation, amount: numAmount, interestRate: numRate, termMonths: numTerm });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Loan Amount (R)</ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="cash" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter loan amount"
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Interest Rate (%)</ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="trending-up" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
              placeholder="Enter interest rate"
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Term (Months)</ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={term}
              onChangeText={setTerm}
              keyboardType="numeric"
              placeholder="Enter term in months"
            />
          </View>
        </ThemedView>

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <CustomGradient
            colors={[Colors.primary, Colors.accent]}
            style={styles.buttonGradient}
          >
            <ThemedText style={[styles.buttonText, { fontFamily: 'MontiBold' }]}>Calculate</ThemedText>
          </CustomGradient>
        </TouchableOpacity>

        {result && (
          <ThemedView style={styles.results}>
            <ThemedText style={styles.resultTitle}>Results</ThemedText>
            <ThemedView style={styles.resultItem}>
              <View style={styles.resultIconContainer}>
                <Ionicons name="card" size={20} color={Colors.primary} />
                <ThemedText style={styles.resultLabel}>Monthly Repayment:</ThemedText>
              </View>
              <ThemedText style={styles.resultValue}>R{result.monthlyRepayment.toFixed(2)}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.resultItem}>
              <View style={styles.resultIconContainer}>
                <Ionicons name="wallet" size={20} color={Colors.primary} />
                <ThemedText style={styles.resultLabel}>Total Repayment:</ThemedText>
              </View>
              <ThemedText style={styles.resultValue}>R{result.totalRepayment.toFixed(2)}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.resultItem}>
              <View style={styles.resultIconContainer}>
                <Ionicons name="trending-up" size={20} color={Colors.primary} />
                <ThemedText style={styles.resultLabel}>Total Interest:</ThemedText>
              </View>
              <ThemedText style={styles.resultValue}>R{result.totalInterest.toFixed(2)}</ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {loanResults.length > 0 && (
          <ThemedView style={styles.history}>
            <ThemedText style={styles.historyTitle}>Recent Calculations</ThemedText>
            {loanResults.slice(0, 5).map((item, index) => (
              <ThemedView key={item.id} style={styles.historyItem}>
                <ThemedText style={styles.historyText}>
                  R{item.amount} @ {item.interestRate}% for {item.termMonths} months
                </ThemedText>
                <ThemedText style={styles.historyResult}>
                  Monthly: R{item.monthlyRepayment.toFixed(2)}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.text,
    fontFamily: 'MontiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: 'MontiLight',
  },
  calculateButton: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
  },
  results: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  resultTitle: {
    fontSize: 16,
    marginBottom: 15,
    color: Colors.text,
    fontFamily: 'MontiBold',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultLabel: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: 'MontiLight',
  },
  resultValue: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'MontiBold',
  },
  history: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    gap:10
  },
  historyTitle: {
    fontSize: 16,
    marginBottom: 15,
    color: Colors.text,
    fontFamily: 'MontiBold',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 10,
    borderRadius:5,
  },
  historyText: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: 'MontiLight',
  },
  historyResult: {
    fontSize: 12,
    color: Colors.text,
    fontFamily: 'MontiBold',
    marginTop: 5,
  },
});