package com.garrizon.service;

import com.garrizon.dto.TransactionDTO;
import com.garrizon.exception.ResourceNotFoundException;
import com.garrizon.model.Transaction;
import com.garrizon.model.Transaction.TransactionStatus;
import com.garrizon.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public Page<TransactionDTO> getAllTransactions(TransactionStatus status, String search, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByFilters(status, search, pageable);
        return transactions.map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToDTO(transaction);
    }

    @Transactional(readOnly = true)
    public TransactionDTO getTransactionByReference(String reference) {
        Transaction transaction = transactionRepository.findByReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with reference: " + reference));
        return mapToDTO(transaction);
    }

    // Statistics methods
    @Transactional(readOnly = true)
    public Long countFailedTransactions() {
        return transactionRepository.countByStatus(TransactionStatus.FAILED);
    }

    @Transactional(readOnly = true)
    public Long countSuccessfulTransactions() {
        return transactionRepository.countByStatus(TransactionStatus.SUCCESS);
    }

    @Transactional(readOnly = true)
    public Long countPendingTransactions() {
        return transactionRepository.countByStatus(TransactionStatus.PENDING);
    }

    // Mapping method
    private TransactionDTO mapToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .reference(transaction.getReference())
                .orderId(transaction.getOrder().getId())
                .orderNumber(transaction.getOrder().getOrderNumber())
                .userId(transaction.getUser().getId())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .status(transaction.getStatus().name())
                .paymentMethod(transaction.getPaymentMethod())
                .paymentGateway(transaction.getPaymentGateway())
                .gatewayReference(transaction.getGatewayReference())
                .customerName(transaction.getCustomerName())
                .customerEmail(transaction.getCustomerEmail())
                .customerPhone(transaction.getCustomerPhone())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .paidAt(transaction.getPaidAt())
                .failedAt(transaction.getFailedAt())
                .build();
    }
}
