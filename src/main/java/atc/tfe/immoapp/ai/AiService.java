package atc.tfe.immoapp.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * Service applicatif simple pour interagir avec un modèle IA via Spring AI.
 * Cette classe encapsule un {@link ChatClient} afin de fournir une méthode utilitaire
 * qui envoie un prompt utilisateur et renvoie directement le contenu textuel de la réponse.
 * <p>
 * Fonctionnement :
 * Le {@link ChatClient} est construit à partir d'un {@link ChatClient.Builder}
 * injecté par Spring (auto-configuré selon tes propriétés Spring AI).
 * {@link #quickAnswer(String)} effectue un appel synchrone au modèle :
 *  prompt(...).call().content() et renvoie le texte de la réponse.
 * <p>
 * Notes
 * Le comportement (modèle, paramètres, timeouts, etc.) dépend de la configuration Spring AI.
 * La méthode est volontairement minimaliste (pas de gestion d'erreurs ou de métadonnées).
 */
@Service
public class AiService {
    private final ChatClient chatClient;

    /**
     * Injection par constructeur du builder Spring AI.
     * Le builder est fourni par Spring (auto-config), puis on construit ici une instance
     * de {@link ChatClient} à partir de ce builder.
     * @param builder builder Spring AI préconfiguré via les properties de l'application
     */
    public AiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    /**
     * Envoie un prompt texte et renvoie la réponse textuelle de l'IA.
     * Méthode synchrone : elle bloque jusqu'à ce que le modèle renvoie une réponse.
     * @param userPrompt le texte saisi par l'utilisateur (contenu du prompt)
     * @return le contenu textuel de la réponse du modèle IA
     * @throws RuntimeException si l'appel échoue en interne (réseau, credentials, config)
     */
    public String quickAnswer(String userPrompt){
        return chatClient.prompt(userPrompt).call().content();
    }
}
