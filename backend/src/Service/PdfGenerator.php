<?php

namespace App\Service;

use App\Entity\QcmVersion;
use Dompdf\Dompdf;
use Dompdf\Options;

class PdfGenerator
{
    public function generateForVersion(QcmVersion $version): string
    {
        $qcm       = $version->getQcm();
        $questions = $version->getQuestions();

        $html = $this->buildHtml($qcm, $questions);

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', false);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }

    private function buildHtml($qcm, $questions): string
    {
        $title   = htmlspecialchars($qcm->getTitle());
        $subject = htmlspecialchars($qcm->getSubject() ?? '');

        $questionsHtml = '';
        $index = 1;
        $letters = ['A', 'B', 'C', 'D', 'E', 'F'];

        foreach ($questions as $question) {
            $content     = htmlspecialchars($question->getContent());
            $choicesHtml = '';
            $ci          = 0;

            foreach ($question->getChoices() as $choice) {
                $label       = htmlspecialchars($choice->getLabel());
                $letter      = $letters[$ci] ?? chr(65 + $ci);
                $choicesHtml .= <<<HTML
                <div class="choice">
                    <span class="choice-letter">{$letter}</span>
                    <span class="choice-label">{$label}</span>
                </div>
                HTML;
                $ci++;
            }

            $questionsHtml .= <<<HTML
            <div class="question">
                <div class="question-header">
                    <span class="question-badge">Question {$index}</span>
                    <span class="question-content">{$content}</span>
                </div>
                <div class="choices">
                    {$choicesHtml}
                </div>
            </div>
            HTML;

            $index++;
        }

        return <<<HTML
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }

                body {
                    font-family: DejaVu Sans, sans-serif;
                    font-size: 11px;
                    color: #1e293b;
                    background: #fff;
                }

                .header {
                    background: #4f46e5;
                    color: white;
                    padding: 28px 32px;
                }

                .header h1 {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 4px;
                    color: #fff;
                }

                .header .meta {
                    font-size: 11px;
                    color: rgba(255,255,255,0.75);
                }

                .candidate-box {
                    padding: 18px 32px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .candidate-field {
                    display: inline-block;
                    margin-right: 32px;
                    min-width: 160px;
                }

                .candidate-field label {
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #94a3b8;
                    display: block;
                    margin-bottom: 6px;
                }

                .candidate-field .line {
                    border-bottom: 1px solid #cbd5e1;
                    width: 160px;
                    height: 18px;
                    display: block;
                }

                .eval-box {
                    padding: 14px 32px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .eval-title {
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #94a3b8;
                    margin-bottom: 10px;
                    display: block;
                }

                .eval-field {
                    display: inline-block;
                    margin-right: 20px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 8px 12px;
                    vertical-align: top;
                    min-width: 110px;
                }

                .eval-field label {
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #94a3b8;
                    display: block;
                    margin-bottom: 8px;
                }

                .eval-field .line {
                    border-bottom: 1px solid #cbd5e1;
                    width: 90px;
                    height: 16px;
                    display: block;
                }

                .note-suffix {
                    font-size: 9px;
                    color: #94a3b8;
                    display: block;
                    margin-top: 3px;
                    text-align: right;
                }

                .questions-wrapper {
                    padding: 20px 32px;
                }

                .question {
                    margin-bottom: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    overflow: hidden;
                    page-break-inside: avoid;
                }

                .question-header {
                    background: #f8fafc;
                    padding: 10px 14px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .question-badge {
                    display: inline-block;
                    background: #4f46e5;
                    color: #fff;
                    font-size: 10px;
                    font-weight: bold;
                    padding: 2px 10px;
                    border-radius: 20px;
                    margin-right: 8px;
                }

                .question-content {
                    font-size: 12px;
                    font-weight: bold;
                    color: #0f172a;
                    vertical-align: middle;
                }

                .choices {
                    padding: 10px 14px;
                }

                .choice {
                    display: block;
                    margin-bottom: 7px;
                    padding: 7px 10px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                }

                .choice-letter {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 1.5px solid #4f46e5;
                    border-radius: 4px;
                    text-align: center;
                    line-height: 18px;
                    font-size: 10px;
                    font-weight: bold;
                    color: #4f46e5;
                    margin-right: 8px;
                    vertical-align: middle;
                }

                .choice-label {
                    vertical-align: middle;
                    color: #334155;
                    font-size: 11px;
                }

                .footer {
                    margin-top: 20px;
                    padding: 12px 32px;
                    border-top: 1px solid #e2e8f0;
                    text-align: center;
                    font-size: 9px;
                    color: #94a3b8;
                }
            </style>
        </head>
        <body>

            <div class="header">
                <h1>{$title}</h1>
                <div class="meta">Matière : {$subject}</div>
            </div>

            <div class="candidate-box">
                <div class="candidate-field">
                    <label>Nom &amp; Prénom</label>
                    <span class="line"></span>
                </div>
                <div class="candidate-field">
                    <label>Date</label>
                    <span class="line"></span>
                </div>
                <div class="candidate-field">
                    <label>Classe / Groupe</label>
                    <span class="line"></span>
                </div>
            </div>

            <div class="eval-box">
                <span class="eval-title">Évaluation</span>
                <div class="eval-field">
                    <label>Note</label>
                    <span class="line"></span>
                    <span class="note-suffix">/ 20</span>
                </div>
                <div class="eval-field">
                    <label>Mention</label>
                    <span class="line"></span>
                </div>
                <div class="eval-field">
                    <label>Correcteur</label>
                    <span class="line"></span>
                </div>
                <div class="eval-field">
                    <label>Signature</label>
                    <span class="line"></span>
                </div>
            </div>

            <div class="questions-wrapper">
                {$questionsHtml}
            </div>

            <div class="footer">
                QSM Generator &nbsp;·&nbsp; {$title}
            </div>

        </body>
        </html>
        HTML;
    }
}
