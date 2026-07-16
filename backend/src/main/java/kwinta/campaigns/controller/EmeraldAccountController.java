package kwinta.campaigns.controller;

import kwinta.campaigns.model.EmeraldAccount;
import kwinta.campaigns.repository.EmeraldAccountRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// wyswietlanie aktualnego stanu konta, wykonywany po zmianach na koncie
// (np. nowa kampania, rozliczenie kampanii)
@RestController
@RequestMapping("/api/account")
public class EmeraldAccountController {

    private final EmeraldAccountRepository accountRepository;

    public EmeraldAccountController(EmeraldAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @GetMapping("/balance")
    public ResponseEntity<EmeraldAccount> getBalance() {
        return accountRepository.findById(1L)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}