<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AiGenerateQcmController
{
    public function __invoke(Request $request): JsonResponse
    {
        $data   = json_decode($request->getContent(), true);
        $prompt = $data['prompt'] ?? null;

        if (!$prompt) {
            return new JsonResponse(['message' => 'Prompt manquant'], 400);
        }

        $groqApiKey = $_ENV['GROQ_API_KEY'] ?? getenv('GROQ_API_KEY') ?? null;

        if (!$groqApiKey) {
            return new JsonResponse(['message' => 'Clé API Groq manquante'], 500);
        }

        $systemPrompt = 'Tu es un générateur de QCM. L\'utilisateur va te décrire un quiz qu\'il veut créer. Tu dois retourner UNIQUEMENT un JSON valide (sans markdown, sans explication) avec cette structure exacte : {"title": "Titre du quiz", "subject": "Sujet", "questions": [{"content": "Texte de la question", "type": "text", "choices": [{"text": "Choix 1", "isCorrect": false}, {"text": "Choix 2", "isCorrect": true}, {"text": "Choix 3", "isCorrect": false}]}]}';

        $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $groqApiKey,
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'model'    => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user',   'content' => $prompt],
            ],
            'temperature' => 0.7,
        ]));

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        curl_close($ch);

        if ($error || !$response) {
            return new JsonResponse(['message' => 'Erreur curl: ' . $error, 'raw' => $response], 500);
        }

        $result = json_decode($response, true);

        if (!$result) {
            return new JsonResponse(['message' => 'JSON decode failed', 'raw' => $response], 500);
        }

        $content = $result['choices'][0]['message']['content'] ?? null;

        if (!$content) {
            return new JsonResponse(['message' => 'Réponse vide de Groq', 'raw' => $result], 500);
        }

        $content = preg_replace('/```json\s*|\s*```/', '', trim($content));

        $qcmData = json_decode($content, true);

        if (!$qcmData) {
            return new JsonResponse(['message' => 'JSON invalide retourné par Groq', 'raw' => $content], 500);
        }

        return new JsonResponse($qcmData);
    }
}
